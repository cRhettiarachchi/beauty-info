/**
 * Trigger.dev job definition — orchestrates the full data refresh pipeline.
 *
 * Steps:
 *  1. For each company, fetch AI signals via Exa
 *  2. Extract structured data from signals via GPT-4o (Task A)
 *  3. Search for decision-maker contacts via Exa
 *  4. Scrape LinkedIn profiles via Bright Data, extract contacts (Task B)
 *  5. Fetch revenue data from SEC EDGAR (US) or Exa + GPT-4o (non-US) (Task C)
 *  6. Validate all source URLs before DB writes
 *  7. Upsert everything into the database
 */

import { task } from "@trigger.dev/sdk/v3";
import { createSupabaseClient } from "@/lib/supabase";
import { searchSignals, searchContacts, searchFinancials } from "@/lib/exa";
import { scrapeLinkedInProfile } from "@/lib/brightdata";
import { getAnnualRevenue } from "@/lib/edgar";
import { extractSignal, extractContacts, extractRevenue } from "@/lib/extract";
import { isUrlAlive } from "@/lib/validate";
import { seedCompanies } from "@/seeds/companies";

export const refreshPipeline = task({
  id: "refresh-pipeline",
  run: async () => {
    const supabase = createSupabaseClient();

    for (const seed of seedCompanies) {
      // 1. Ensure company exists in DB
      const { data: company, error: upsertError } = await supabase
        .from("companies")
        .upsert(
          {
            name: seed.name,
            ticker: seed.ticker,
            sec_cik: seed.secCik,
            website: seed.website,
            linkedin_url: seed.linkedinUrl,
            ir_page_url: seed.irPageUrl,
          },
          { onConflict: "name" }
        )
        .select()
        .single();

      if (upsertError || !company) {
        console.error(`Failed to upsert company ${seed.name}:`, upsertError);
        continue;
      }

      // 2. AI Signals
      try {
        const signalResults = await searchSignals(seed.name);
        for (const result of signalResults.results) {
          const extracted = await extractSignal(result.text ?? "", result.url);
          if ("error" in extracted) continue;

          const urlValid = await isUrlAlive(result.url);
          if (!urlValid) {
            await supabase
              .from("failed_urls")
              .insert({ url: result.url, reason: "HEAD check failed", context: "signal" });
            continue;
          }

          await supabase.from("signals").insert({
            company_id: company.id,
            signal_type: extracted.signal_type,
            summary: extracted.summary,
            ai_relevance_score: extracted.ai_relevance_score,
            low_relevance: extracted.low_relevance ?? false,
            published_date: extracted.published_date,
            source_url: extracted.source_url,
          });
        }
      } catch (err) {
        console.error(`Signal extraction failed for ${seed.name}:`, err);
      }

      // 3. Contacts
      try {
        const contactResults = await searchContacts(seed.name);
        for (const result of contactResults.results) {
          // If LinkedIn URL, scrape via Bright Data for richer content
          let text = result.text ?? "";
          if (result.url.includes("linkedin.com")) {
            try {
              text = await scrapeLinkedInProfile(result.url);
            } catch {
              // fall back to Exa text
            }
          }

          const extracted = await extractContacts(text, result.url);
          if ("error" in extracted) continue;

          const contacts = Array.isArray(extracted) ? extracted : [extracted];
          for (const contact of contacts) {
            const urlValid = await isUrlAlive(result.url);
            if (!urlValid) {
              await supabase
                .from("failed_urls")
                .insert({ url: result.url, reason: "HEAD check failed", context: "contact" });
              continue;
            }

            await supabase.from("contacts").insert({
              company_id: company.id,
              name: contact.name,
              title: contact.title,
              region: contact.region,
              linkedin_url: contact.linkedin_url,
              email: contact.email,
              source_url: contact.source_url,
            });
          }
        }
      } catch (err) {
        console.error(`Contact extraction failed for ${seed.name}:`, err);
      }

      // 4. Revenue / Financials
      try {
        if (seed.secCik) {
          // US company — use SEC EDGAR
          const records = await getAnnualRevenue(seed.secCik);
          const sourceUrl = `https://data.sec.gov/api/xbrl/companyfacts/CIK${seed.secCik.padStart(10, "0")}.json`;

          for (const rec of records) {
            await supabase.from("revenue_records").insert({
              company_id: company.id,
              year: rec.year,
              revenue: rec.revenue,
              currency: "USD",
              segment: "Total",
              source_url: sourceUrl,
            });
          }
        } else {
          // Non-US — fall back to Exa search + GPT-4o extraction
          const financialResults = await searchFinancials(seed.name);
          for (const result of financialResults.results) {
            const extracted = await extractRevenue(result.text ?? "", result.url);
            if ("error" in extracted) continue;

            const urlValid = await isUrlAlive(result.url);
            if (!urlValid) {
              await supabase
                .from("failed_urls")
                .insert({ url: result.url, reason: "HEAD check failed", context: "revenue" });
              continue;
            }

            for (const rec of extracted.records) {
              await supabase.from("revenue_records").insert({
                company_id: company.id,
                year: rec.year,
                revenue: rec.revenue,
                currency: rec.currency,
                revenue_growth_pct: rec.revenue_growth_pct,
                segment: rec.segment,
                source_url: extracted.source_url,
              });
            }
          }
        }
      } catch (err) {
        console.error(`Revenue extraction failed for ${seed.name}:`, err);
      }
    }

    return { success: true, companiesProcessed: seedCompanies.length };
  },
});

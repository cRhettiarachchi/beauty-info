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
 *
 * This file is a scaffold — implement each step against your Trigger.dev project.
 */

// import { task } from "@trigger.dev/sdk/v3";
// import { PrismaClient } from "@prisma/client";
// import { searchSignals, searchContacts, searchFinancials } from "@/lib/exa";
// import { scrapeLinkedInProfile } from "@/lib/brightdata";
// import { getAnnualRevenue } from "@/lib/edgar";
// import { extractSignal, extractContacts, extractRevenue } from "@/lib/extract";
// import { isUrlAlive } from "@/lib/validate";
// import { seedCompanies } from "@/seeds/companies";

// const prisma = new PrismaClient();

/*
export const refreshPipeline = task({
  id: "refresh-pipeline",
  run: async () => {
    for (const seed of seedCompanies) {
      // 1. Ensure company exists in DB
      const company = await prisma.company.upsert({
        where: { name: seed.name },
        update: {},
        create: {
          name: seed.name,
          ticker: seed.ticker,
          secCik: seed.secCik,
          website: seed.website,
          linkedinUrl: seed.linkedinUrl,
          irPageUrl: seed.irPageUrl,
        },
      });

      // 2. AI Signals
      try {
        const signalResults = await searchSignals(seed.name);
        for (const result of signalResults.results) {
          const extracted = await extractSignal(result.text ?? "", result.url);
          if ("error" in extracted) continue;

          const urlValid = await isUrlAlive(result.url);
          if (!urlValid) {
            await prisma.failedUrl.create({
              data: { url: result.url, reason: "HEAD check failed", context: "signal" },
            });
            continue;
          }

          await prisma.signal.create({
            data: {
              companyId: company.id,
              signalType: extracted.signal_type,
              summary: extracted.summary,
              aiRelevanceScore: extracted.ai_relevance_score,
              lowRelevance: extracted.low_relevance ?? false,
              publishedDate: extracted.published_date ? new Date(extracted.published_date) : null,
              sourceUrl: extracted.source_url,
            },
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
              await prisma.failedUrl.create({
                data: { url: result.url, reason: "HEAD check failed", context: "contact" },
              });
              continue;
            }

            await prisma.contact.create({
              data: {
                companyId: company.id,
                name: contact.name,
                title: contact.title,
                region: contact.region,
                linkedinUrl: contact.linkedin_url,
                email: contact.email,
                sourceUrl: contact.source_url,
              },
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
            await prisma.revenueRecord.create({
              data: {
                companyId: company.id,
                year: rec.year,
                revenue: rec.revenue,
                currency: "USD",
                segment: "Total",
                sourceUrl,
              },
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
              await prisma.failedUrl.create({
                data: { url: result.url, reason: "HEAD check failed", context: "revenue" },
              });
              continue;
            }

            for (const rec of extracted.records) {
              await prisma.revenueRecord.create({
                data: {
                  companyId: company.id,
                  year: rec.year,
                  revenue: rec.revenue,
                  currency: rec.currency,
                  revenueGrowthPct: rec.revenue_growth_pct,
                  segment: rec.segment,
                  sourceUrl: extracted.source_url,
                },
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
*/

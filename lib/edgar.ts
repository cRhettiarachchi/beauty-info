/**
 * SEC EDGAR XBRL financial data fetcher.
 *
 * Uses the free public API at data.sec.gov — no API key required.
 * Rate limit: 10 requests/second; set a proper User-Agent per SEC policy.
 */

const SEC_BASE = "https://data.sec.gov";
const USER_AGENT = "BeautyProspectResearch admin@example.com"; // SEC requires a descriptive UA

interface CompanyFacts {
  cik: number;
  entityName: string;
  facts: {
    "us-gaap"?: Record<string, FactEntry>;
  };
}

interface FactEntry {
  label: string;
  description: string;
  units: Record<string, FactUnit[]>;
}

interface FactUnit {
  val: number;
  accn: string;
  fy: number;
  fp: string; // "FY", "Q1", "Q2", etc.
  form: string; // "10-K", "10-Q"
  filed: string;
  start?: string;
  end?: string;
}

export interface EdgarRevenueRecord {
  year: number;
  revenue: number; // in millions USD
  form: string;
  filed: string;
}

/**
 * Fetch company facts from SEC EDGAR for a given CIK.
 */
async function fetchCompanyFacts(cik: string): Promise<CompanyFacts> {
  const paddedCik = cik.padStart(10, "0");
  const url = `${SEC_BASE}/api/xbrl/companyfacts/CIK${paddedCik}.json`;

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT },
  });

  if (!res.ok) {
    throw new Error(`EDGAR fetch failed for CIK ${cik}: ${res.status}`);
  }

  return res.json() as Promise<CompanyFacts>;
}

/**
 * Extract annual revenue figures from SEC EDGAR for a US-listed company.
 *
 * Looks for Revenues or RevenueFromContractWithCustomerExcludingAssessedTax
 * in the us-gaap taxonomy.
 */
export async function getAnnualRevenue(
  cik: string
): Promise<EdgarRevenueRecord[]> {
  const facts = await fetchCompanyFacts(cik);
  const gaap = facts.facts["us-gaap"];
  if (!gaap) return [];

  // Try multiple common revenue concept names
  const revenueConcepts = [
    "Revenues",
    "RevenueFromContractWithCustomerExcludingAssessedTax",
    "SalesRevenueNet",
    "RevenueFromContractWithCustomerIncludingAssessedTax",
  ];

  for (const concept of revenueConcepts) {
    const entry = gaap[concept];
    if (!entry) continue;

    const usdUnits = entry.units["USD"];
    if (!usdUnits) continue;

    // Filter to annual 10-K filings only
    const annualRecords = usdUnits
      .filter((u) => u.form === "10-K" && u.fp === "FY")
      .map((u) => ({
        year: u.fy,
        revenue: Math.round(u.val / 1_000_000), // convert to millions
        form: u.form,
        filed: u.filed,
      }))
      // Deduplicate by year (keep latest filing)
      .reduce<EdgarRevenueRecord[]>((acc, rec) => {
        const existing = acc.find((r) => r.year === rec.year);
        if (!existing || rec.filed > existing.filed) {
          return [...acc.filter((r) => r.year !== rec.year), rec];
        }
        return acc;
      }, [])
      .sort((a, b) => b.year - a.year);

    if (annualRecords.length > 0) return annualRecords;
  }

  return [];
}

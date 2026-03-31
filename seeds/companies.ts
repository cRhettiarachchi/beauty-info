/**
 * Static seed list of target beauty companies.
 *
 * For each US-listed company the SEC CIK is included so the EDGAR pipeline
 * can deterministically fetch the correct 10-K filings.
 *
 * Non-US companies (L'Oréal, Shiseido, Beiersdorf, Amorepacific, etc.)
 * have secCik set to null — the pipeline falls back to crawling their IR page.
 *
 * How to look up a CIK:
 *   https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&company={name}&type=10-K
 */

export interface SeedCompany {
  name: string;
  ticker: string | null;
  secCik: string | null;
  website: string;
  linkedinUrl: string;
  irPageUrl: string;
}

export const seedCompanies: SeedCompany[] = [
  // ── US-listed companies (have SEC CIK) ──────────────────────────────
  {
    name: "Estée Lauder Companies",
    ticker: "EL",
    secCik: "1001250",
    website: "https://www.elcompanies.com",
    linkedinUrl: "https://www.linkedin.com/company/the-estee-lauder-companies",
    irPageUrl: "https://ir.elcompanies.com",
  },
  {
    name: "Procter & Gamble",
    ticker: "PG",
    secCik: "80424",
    website: "https://us.pg.com",
    linkedinUrl: "https://www.linkedin.com/company/procter-and-gamble",
    irPageUrl: "https://pginvestor.com",
  },
  {
    name: "Coty Inc.",
    ticker: "COTY",
    secCik: "1024305",
    website: "https://www.coty.com",
    linkedinUrl: "https://www.linkedin.com/company/coty",
    irPageUrl: "https://investors.coty.com",
  },
  {
    name: "Revlon",
    ticker: "REV",
    secCik: "887921",
    website: "https://www.revloninc.com",
    linkedinUrl: "https://www.linkedin.com/company/revlon",
    irPageUrl: "https://www.revloninc.com/investor-relations",
  },
  {
    name: "e.l.f. Beauty",
    ticker: "ELF",
    secCik: "1600033",
    website: "https://www.elfbeauty.com",
    linkedinUrl: "https://www.linkedin.com/company/e-l-f-beauty",
    irPageUrl: "https://investor.elfbeauty.com",
  },
  {
    name: "Inter Parfums",
    ticker: "IPAR",
    secCik: "806592",
    website: "https://www.interparfumsinc.com",
    linkedinUrl: "https://www.linkedin.com/company/inter-parfums",
    irPageUrl: "https://www.interparfumsinc.com/investors",
  },
  {
    name: "Olaplex Holdings",
    ticker: "OLPX",
    secCik: "1868726",
    website: "https://www.olaplex.com",
    linkedinUrl: "https://www.linkedin.com/company/olaplex",
    irPageUrl: "https://ir.olaplex.com",
  },
  {
    name: "Honest Company",
    ticker: "HNST",
    secCik: "1808805",
    website: "https://www.honest.com",
    linkedinUrl: "https://www.linkedin.com/company/the-honest-company",
    irPageUrl: "https://investor.honest.com",
  },
  {
    name: "Beauty Health (HydraFacial)",
    ticker: "SKIN",
    secCik: "1818093",
    website: "https://beautyhealth.com",
    linkedinUrl: "https://www.linkedin.com/company/the-beauty-health-company",
    irPageUrl: "https://investors.beautyhealth.com",
  },
  {
    name: "Ulta Beauty",
    ticker: "ULTA",
    secCik: "1337640",
    website: "https://www.ulta.com",
    linkedinUrl: "https://www.linkedin.com/company/ulta-beauty",
    irPageUrl: "https://ir.ultabeauty.com",
  },
  {
    name: "Sally Beauty Holdings",
    ticker: "SBH",
    secCik: "1368458",
    website: "https://www.sallybeautyholdings.com",
    linkedinUrl: "https://www.linkedin.com/company/sally-beauty-holdings",
    irPageUrl: "https://investor.sallybeautyholdings.com",
  },
  {
    name: "Nu Skin Enterprises",
    ticker: "NUS",
    secCik: "1021129",
    website: "https://www.nuskin.com",
    linkedinUrl: "https://www.linkedin.com/company/nu-skin-enterprises",
    irPageUrl: "https://ir.nuskin.com",
  },
  {
    name: "USANA Health Sciences",
    ticker: "USNA",
    secCik: "896264",
    website: "https://www.usana.com",
    linkedinUrl: "https://www.linkedin.com/company/usana-health-sciences",
    irPageUrl: "https://ir.usana.com",
  },
  {
    name: "Herbalife",
    ticker: "HLF",
    secCik: "1180262",
    website: "https://www.herbalife.com",
    linkedinUrl: "https://www.linkedin.com/company/herbalife",
    irPageUrl: "https://ir.herbalife.com",
  },
  {
    name: "Church & Dwight",
    ticker: "CHD",
    secCik: "313927",
    website: "https://www.churchdwight.com",
    linkedinUrl: "https://www.linkedin.com/company/church-dwight",
    irPageUrl: "https://www.churchdwight.com/investors",
  },

  // ── Non-US companies (no SEC CIK — fall back to IR page crawling) ───
  {
    name: "L'Oréal",
    ticker: "OR.PA",
    secCik: null,
    website: "https://www.loreal.com",
    linkedinUrl: "https://www.linkedin.com/company/loreal",
    irPageUrl: "https://www.loreal-finance.com",
  },
  {
    name: "Shiseido",
    ticker: "4911.T",
    secCik: null,
    website: "https://www.shiseidogroup.com",
    linkedinUrl: "https://www.linkedin.com/company/shiseido",
    irPageUrl: "https://corp.shiseido.com/en/ir",
  },
  {
    name: "Beiersdorf",
    ticker: "BEI.DE",
    secCik: null,
    website: "https://www.beiersdorf.com",
    linkedinUrl: "https://www.linkedin.com/company/beiersdorf",
    irPageUrl: "https://www.beiersdorf.com/investors",
  },
  {
    name: "Amorepacific",
    ticker: "090430.KS",
    secCik: null,
    website: "https://www.apgroup.com",
    linkedinUrl: "https://www.linkedin.com/company/amorepacific",
    irPageUrl: "https://www.apgroup.com/int/en/investors",
  },
  {
    name: "Henkel (Beauty Care)",
    ticker: "HEN3.DE",
    secCik: null,
    website: "https://www.henkel.com",
    linkedinUrl: "https://www.linkedin.com/company/henkel",
    irPageUrl: "https://www.henkel.com/investors-and-analysts",
  },
  {
    name: "Kao Corporation",
    ticker: "4452.T",
    secCik: null,
    website: "https://www.kao.com",
    linkedinUrl: "https://www.linkedin.com/company/kao",
    irPageUrl: "https://www.kao.com/global/en/investor-relations",
  },
  {
    name: "Puig",
    ticker: "PUIG.MC",
    secCik: null,
    website: "https://www.puig.com",
    linkedinUrl: "https://www.linkedin.com/company/puig",
    irPageUrl: "https://www.puig.com/en/investors",
  },
  {
    name: "Natura &Co",
    ticker: "NTCO3.SA",
    secCik: null,
    website: "https://www.naturaeco.com",
    linkedinUrl: "https://www.linkedin.com/company/natura-co",
    irPageUrl: "https://ri.naturaeco.com/en",
  },
  {
    name: "Kose Corporation",
    ticker: "4922.T",
    secCik: null,
    website: "https://www.kose.co.jp/en",
    linkedinUrl: "https://www.linkedin.com/company/kose-corporation",
    irPageUrl: "https://www.kose.co.jp/company/en/ir",
  },
  {
    name: "LG Household & Health Care",
    ticker: "051900.KS",
    secCik: null,
    website: "https://www.lgcare.com",
    linkedinUrl: "https://www.linkedin.com/company/lg-household-health-care",
    irPageUrl: "https://www.lgcare.com/en/ir",
  },
  {
    name: "Unilever (Beauty & Wellbeing)",
    ticker: "ULVR.L",
    secCik: null,
    website: "https://www.unilever.com",
    linkedinUrl: "https://www.linkedin.com/company/unilever",
    irPageUrl: "https://www.unilever.com/investors",
  },
  {
    name: "Colgate-Palmolive",
    ticker: "CL",
    secCik: "21665",
    website: "https://www.colgatepalmolive.com",
    linkedinUrl: "https://www.linkedin.com/company/colgate-palmolive",
    irPageUrl: "https://investor.colgatepalmolive.com",
  },
  {
    name: "Edgewell Personal Care",
    ticker: "EPC",
    secCik: "1096752",
    website: "https://www.edgewell.com",
    linkedinUrl: "https://www.linkedin.com/company/edgewell-personal-care",
    irPageUrl: "https://ir.edgewell.com",
  },
  {
    name: "Oddity Tech (IL Makiage)",
    ticker: "ODD",
    secCik: "1958927",
    website: "https://www.oddity.com",
    linkedinUrl: "https://www.linkedin.com/company/odditytech",
    irPageUrl: "https://investors.oddity.com",
  },
  {
    name: "Prestige Consumer Healthcare",
    ticker: "PBH",
    secCik: "1295947",
    website: "https://www.prestigeconsumerhealthcare.com",
    linkedinUrl: "https://www.linkedin.com/company/prestige-consumer-healthcare",
    irPageUrl: "https://ir.prestigeconsumerhealthcare.com",
  },
];

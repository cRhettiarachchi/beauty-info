/**
 * Exa AI search helpers for signal discovery, contact finding, and financial data.
 *
 * Requires EXA_API_KEY environment variable.
 * Docs: https://docs.exa.ai
 */

const EXA_API_URL = "https://api.exa.ai/search";

interface ExaSearchOptions {
  type?: "news" | "auto";
  numResults?: number;
  startPublishedDate?: string;
  includeDomains?: string[];
}

interface ExaResult {
  title: string;
  url: string;
  publishedDate?: string;
  text?: string;
}

interface ExaResponse {
  results: ExaResult[];
}

async function exaSearch(
  query: string,
  options: ExaSearchOptions = {}
): Promise<ExaResponse> {
  const apiKey = process.env.EXA_API_KEY;
  if (!apiKey) throw new Error("EXA_API_KEY is not set");

  const res = await fetch(EXA_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
    },
    body: JSON.stringify({
      query,
      type: options.type ?? "auto",
      numResults: options.numResults ?? 10,
      contents: { text: true },
      ...(options.startPublishedDate && {
        startPublishedDate: options.startPublishedDate,
      }),
      ...(options.includeDomains && {
        includeDomains: options.includeDomains,
      }),
    }),
  });

  if (!res.ok) {
    throw new Error(`Exa search failed: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<ExaResponse>;
}

/** Search for AI / marketing technology signals for a company. */
export async function searchSignals(companyName: string): Promise<ExaResponse> {
  const query = `"${companyName}" generative AI OR marketing technology OR AI investment OR AI startup`;
  return exaSearch(query, {
    type: "news",
    numResults: 10,
    startPublishedDate: "2025-01-01",
  });
}

/** Search for decision-maker contacts at a company. */
export async function searchContacts(
  companyName: string
): Promise<ExaResponse> {
  const query = `"${companyName}" "VP" OR "Director" OR "Head of" "Digital Marketing" OR "Marketing Technology" OR "AI"`;
  return exaSearch(query, {
    type: "auto",
    numResults: 8,
    includeDomains: ["linkedin.com", "bloomberg.com", "ft.com"],
  });
}

/** Search for revenue / financial data for non-SEC companies. */
export async function searchFinancials(
  companyName: string
): Promise<ExaResponse> {
  const query = `${companyName} annual revenue fiscal year 2024 2025`;
  return exaSearch(query, {
    type: "auto",
    numResults: 5,
  });
}

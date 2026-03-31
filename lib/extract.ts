/**
 * GPT-4o structured extraction calls for Tasks A, B, and C.
 *
 * Requires OPENAI_API_KEY environment variable.
 */

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

// ── Types ──────────────────────────────────────────────────────────────

export interface SignalExtraction {
  signal_type: string;
  company_name: string;
  summary: string;
  ai_relevance_score: number;
  published_date: string | null;
  source_url: string;
  low_relevance?: boolean;
}

export interface ContactExtraction {
  name: string | null;
  title: string | null;
  company: string | null;
  region: string | null;
  linkedin_url: string | null;
  email: string | null;
  source_url: string;
}

export interface RevenueExtraction {
  company_name: string;
  records: {
    year: number;
    revenue: number | null;
    currency: string | null;
    revenue_growth_pct: number | null;
    segment: string | null;
  }[];
  source_url: string;
}

export interface ExtractionError {
  error: "insufficient_content";
  reason: string;
}

// ── System prompt (from AI_AGENT_PROMPT.md) ────────────────────────────

const SYSTEM_PROMPT = `You are a structured data extraction agent for a B2B sales intelligence platform targeting the beauty industry.

## Your Role
You receive raw content — web page text, news articles, scraped HTML converted to markdown, or SEC filing text — and extract structured JSON from it. You are NOT a search engine. You do NOT retrieve URLs, generate information, or fill in gaps from your training data.

## Core Rules
1. ONLY extract information explicitly present in the provided source text.
2. If a field is not present in the source text, set it to null. Never guess, infer, or fabricate.
3. Every extracted fact must map to a specific sentence or passage in the source text.
4. source_url must always be the actual URL of the page the content came from — passed to you alongside the content. Never generate a URL.
5. Output must be valid JSON matching the schema provided in the user message.

## Reliability Guardrails
- If the source text is too short, garbled, or clearly a login/error page, return: { "error": "insufficient_content", "reason": "<brief description>" }
- If ai_relevance_score would be below 0.3 for Task A, still return the record but flag: "low_relevance": true
- Never produce markdown, prose, or explanation in your output — only raw JSON.`;

// ── Helper ─────────────────────────────────────────────────────────────

async function callGpt4o(userMessage: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const res = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      temperature: 0,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`OpenAI API error: ${res.status} ${res.statusText}`);
  }

  const data = (await res.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0].message.content;
}

// ── Task A — Signal Extraction ─────────────────────────────────────────

export async function extractSignal(
  sourceText: string,
  sourceUrl: string
): Promise<SignalExtraction | ExtractionError> {
  const prompt = `Task A — AI Investment / Activity Signal Extraction.

Source URL: ${sourceUrl}

Source text:
${sourceText}

Output JSON matching this schema:
{
  "signal_type": "ai_investment" | "ai_adoption" | "exec_hire" | "partnership" | "product_launch" | "other",
  "company_name": string,
  "summary": string (max 2 sentences, factual only),
  "ai_relevance_score": number 0.0–1.0,
  "published_date": "YYYY-MM-DD" | null,
  "source_url": string
}`;

  const raw = await callGpt4o(prompt);
  return JSON.parse(raw);
}

// ── Task B — Contact Extraction ────────────────────────────────────────

export async function extractContacts(
  sourceText: string,
  sourceUrl: string
): Promise<ContactExtraction | ContactExtraction[] | ExtractionError> {
  const prompt = `Task B — Contact / Decision Maker Extraction.

Source URL: ${sourceUrl}

Source text:
${sourceText}

Output JSON matching this schema (return an array if multiple people found):
{
  "name": string | null,
  "title": string | null,
  "company": string | null,
  "region": string | null,
  "linkedin_url": string | null,
  "email": string | null,
  "source_url": string
}`;

  const raw = await callGpt4o(prompt);
  return JSON.parse(raw);
}

// ── Task C — Revenue Extraction ────────────────────────────────────────

export async function extractRevenue(
  sourceText: string,
  sourceUrl: string
): Promise<RevenueExtraction | ExtractionError> {
  const prompt = `Task C — Revenue / Financial Data Extraction.

Source URL: ${sourceUrl}

Source text:
${sourceText}

Output JSON matching this schema:
{
  "company_name": string,
  "records": [
    {
      "year": number,
      "revenue": number | null (in millions, native currency),
      "currency": string | null,
      "revenue_growth_pct": number | null,
      "segment": string | null
    }
  ],
  "source_url": string
}`;

  const raw = await callGpt4o(prompt);
  return JSON.parse(raw);
}

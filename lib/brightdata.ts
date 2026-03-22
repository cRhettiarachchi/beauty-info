/**
 * Bright Data scraping helpers for LinkedIn and protected pages.
 *
 * Requires BRIGHT_DATA_USERNAME, BRIGHT_DATA_PASSWORD, BRIGHT_DATA_HOST,
 * and BRIGHT_DATA_PORT environment variables.
 */

interface BrightDataConfig {
  username: string;
  password: string;
  host: string;
  port: number;
}

function getConfig(): BrightDataConfig {
  const username = process.env.BRIGHT_DATA_USERNAME;
  const password = process.env.BRIGHT_DATA_PASSWORD;
  const host = process.env.BRIGHT_DATA_HOST ?? "brd.superproxy.io";
  const port = parseInt(process.env.BRIGHT_DATA_PORT ?? "22225", 10);

  if (!username || !password) {
    throw new Error(
      "BRIGHT_DATA_USERNAME and BRIGHT_DATA_PASSWORD must be set"
    );
  }

  return { username, password, host, port };
}

/**
 * Scrape a URL through Bright Data Web Unlocker proxy.
 * Returns the page content as text (HTML).
 */
export async function scrapeUrl(targetUrl: string): Promise<string> {
  const config = getConfig();
  const proxyUrl = `http://${config.username}:${config.password}@${config.host}:${config.port}`;

  const res = await fetch(targetUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    },
    // @ts-expect-error — proxy agent varies by runtime
    agent: new (await import("https-proxy-agent")).HttpsProxyAgent(proxyUrl),
  });

  if (!res.ok) {
    throw new Error(
      `Bright Data scrape failed for ${targetUrl}: ${res.status} ${res.statusText}`
    );
  }

  return res.text();
}

/**
 * Scrape a LinkedIn profile URL via Bright Data.
 * Returns raw HTML — pass through an HTML-to-markdown converter before extraction.
 */
export async function scrapeLinkedInProfile(
  linkedinUrl: string
): Promise<string> {
  return scrapeUrl(linkedinUrl);
}

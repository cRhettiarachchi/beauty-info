/**
 * URL validation — checks that a URL is alive and doesn't redirect to a generic homepage.
 *
 * Call this on every sourceUrl before inserting a Signal, Contact, or RevenueRecord.
 */

export async function isUrlAlive(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: AbortSignal.timeout(5000),
    });
    // Reject if not OK or if it redirected away from the original host
    return res.ok && res.url.includes(new URL(url).hostname);
  } catch {
    return false;
  }
}

/**
 * Cloudflare Pages Function — same-origin events proxy.
 *
 * The public site scrapes the WordPress "Events Manager" archive from
 * mehmetpolat.net. A browser can't fetch that cross-origin (no CORS
 * headers there), and public CORS proxies are unreliable / blocked.
 * This function runs at the edge on our own domain, fetches the archive
 * server-side (no CORS restriction), and returns the raw HTML with an
 * Access-Control-Allow-Origin header so the client can parse it.
 *
 * It is NOT an open proxy: the target host is hardcoded to mehmetpolat.net,
 * so it can't be abused to fetch arbitrary URLs.
 *
 * Served at:  /api/events
 */

const BASE = 'https://mehmetpolat.net/events/';

const FETCH_OPTS = {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (compatible; MehmetPolatSite/1.0; +https://mehmetpolat.net)',
    'Accept': 'text/html,application/xhtml+xml',
    'Accept-Language': 'en,nl;q=0.8',
  },
  // Cache at the edge for 30 minutes so we don't hammer the WP site.
  cf: { cacheTtl: 1800, cacheEverything: true },
};

export async function onRequest() {
  try {
    // Pull both the default listing and the past-events scope, in parallel,
    // and concatenate so the client gets the full archive in one response.
    const [def, past] = await Promise.all([
      fetch(BASE, FETCH_OPTS).then(r => (r.ok ? r.text() : '')),
      fetch(BASE + '?scope=past', FETCH_OPTS).then(r => (r.ok ? r.text() : '')),
    ]);

    const html = `${def}\n<!-- scope=past -->\n${past}`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        // Let the browser/edge cache the combined result too.
        'Cache-Control': 'public, max-age=1800',
      },
    });
  } catch (err) {
    return new Response('Upstream fetch failed', {
      status: 502,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  }
}

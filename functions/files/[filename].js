/**
 * Cloudflare Pages Function — serve files from R2 storage.
 *
 * Any file uploaded to the "mehmet-polat-media" R2 bucket is accessible at:
 *   https://[your-domain]/files/<filename>
 *
 * Examples:
 *   /files/press-kit.pdf
 *   /files/tour-rider.pdf
 *   /files/mehmet-polat-bio.pdf
 *
 * Upload files via the Cloudflare dashboard → R2 → mehmet-polat-media,
 * or with: npx wrangler r2 object put mehmet-polat-media/filename.pdf --file=filename.pdf
 */

export async function onRequest({ params, env, request }) {
  const key = decodeURIComponent(params.filename);

  const object = await env.MEDIA.get(key);
  if (!object) {
    return new Response('File not found', { status: 404 });
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  // Cache files for 1 year — re-upload with a new name to bust the cache
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  // Allow embedding in iframes (useful for PDF previews)
  headers.set('x-frame-options', 'SAMEORIGIN');

  return new Response(object.body, { headers });
}

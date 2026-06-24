#!/usr/bin/env node
// Run: node fetch-reviews.js > reviews.json
// Fetches all press review content from WordPress before it goes offline.

const https = require('https');

const SLUGS = [
  'album-review-for-ageless-garden-in-cazkolik-turkey',
  'album-review-for-ageless-garden-in-heaven-magazine',
  'album-review-for-ageless-garden-in-mixedworldmusic-com',
  'album-review-for-ageless-garden-in-moors-magazine',
  'album-review-for-ageless-garden-in-new-folk-sounds',
  'album-review-for-ageless-garden-in-new-york-music-daily',
  'album-review-for-ageless-garden-in-rootstime-belgium',
  'album-review-for-ask-your-heart-on-doobeedoobeedoo-new-york-usa',
  'album-review-for-ask-your-heart-on-jazz-flits-netherlands-by-herman-te-loo',
  'album-review-for-ask-your-heart-on-le-soir-plus-belgium',
  'album-review-for-ask-your-heart-on-london-jazz-news-uk',
  'album-review-for-ask-your-heart-on-mixed-world-music-by-ton-maas',
  'album-review-for-ask-your-heart-on-music-frames-netherlands-by-mattie-poels',
  'album-review-for-ask-your-heart-on-music-in-belgium-belgium',
  'album-review-for-ask-your-heart-on-new-york-music-daily-usa',
  'album-review-for-embodied-poetry-in-blogfoolk',
  'album-review-for-embodied-poetry-in-cumhuriyet-tr',
  'album-review-for-embodied-poetry-in-jazzflits-nl',
  'album-review-for-embodied-poetry-in-jazzmania-be',
  'album-review-for-embodied-poetry-in-jazznu',
  'album-review-for-embodied-poetry-in-lira-magazine-se',
  'album-review-for-embodied-poetry-in-moors-magazine-nl',
  'album-review-for-embodied-poetry-in-muziekwereld-by-ntb',
  'album-review-for-embodied-poetry-in-newfolksounds-nl',
  'album-review-for-embodied-poetry-in-rootstime-be',
  'album-review-for-next-spring-on-music-frames-netherlands-by-mattie-poels',
  'album-review-for-quantum-leap-in-cumhuriyet-turkey',
  'album-review-for-quantum-leap-in-doobeedoobeedoo-ny-usa',
  'album-review-for-quantum-leap-in-jazz-halo-belgium',
  'album-review-for-quantum-leap-in-moors-magazine-belgium',
  'album-review-for-quantum-leap-in-music-frames-netherlands',
  'album-review-for-quantum-leap-in-new-york-music-daily',
  'album-review-for-quantum-leap-in-on-top-of-music-netherlands',
  'album-review-for-quantum-leap-in-rootstime-belgium',
  'album-review-for-roots-in-motion-in-blogfoolk-it',
  'album-review-for-roots-in-motion-in-festivalinfo-nl',
  'album-review-for-roots-in-motion-in-jazzflits-nl',
  'album-review-for-roots-in-motion-in-jazzquad-ru',
  'album-review-for-roots-in-motion-in-keys-and-chords-nl',
  'album-review-for-roots-in-motion-in-lira-musikmagasin-se',
  'album-review-for-roots-in-motion-in-moors-magazine-nl',
  'album-review-for-roots-in-motion-in-new-folk-sounds-nl',
  'album-review-for-roots-in-motion-in-rootstime-be',
  'album-review-for-roots-in-motion-in-sk-jazz-sk',
  'album-review-for-the-promise-in-blogfoolk-magazine-italy',
  'album-review-for-the-promise-in-cazkolik',
  'album-review-for-the-promise-in-doobeedoobeedoo',
  'album-review-for-the-promise-in-jazzflits',
  'album-review-for-the-promise-in-keys-chords',
  'album-review-for-the-promise-in-lira-world-music-magazine',
  'album-review-for-the-promise-in-moors-magazine',
  'album-review-for-the-promise-in-new-folk-sounds',
  'album-review-for-the-promise-in-new-york-music-daily',
  'album-review-for-the-promise-in-rebelbase-be',
  'album-review-for-the-promise-in-rootstime-be',
  'album-review-for-the-promise-in-songlines',
  'album-review-for-the-promise-in-tropicalidad-be',
  'album-review-for-the-promise-in-world-music-central',
  'album-review-on-ageless-garden-from-new-york-doobeedoobeedoo',
  'concert-review-for-mehmet-polat-quartet-in-de-x-at-leidsche-dagblad',
  'concert-review-for-mehmet-polat-quartet-in-theater-de-lieve-vrouw-in-amsersfoort-at-jazzism',
  'ethnotempos-france',
  'jazz-n-more-magazine-switzerland',
  'jazzenzo-nl-live',
  'jazzkaar-festival-estonia-live',
  'jazzrytmit-finland-live',
  'music-whatever-usa-live',
];

const URL_FIXES = {
  'album-review-for-roots-in-motion-in-rootstime-be': 'https://www.rootstime.be/CD%20REVIEUW/2025/MEI1/CD12.html',
};

function fetchSlug(slug) {
  return new Promise(resolve => {
    const url = `https://mehmetpolat.net/wp-json/wp/v2/posts?slug=${slug}&_fields=content`;
    https.get(url, { timeout: 10000 }, res => {
      let raw = '';
      res.on('data', c => raw += c);
      res.on('end', () => {
        try {
          const posts = JSON.parse(raw);
          if (!posts?.[0]) { resolve(null); return; }
          const html = posts[0].content?.rendered || '';
          const text = html
            .replace(/<[^>]+>/g, ' ')
            .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
            .replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ').trim();
          const extMatch = html.match(/href="(https?:\/\/(?!mehmetpolat\.net)[^\s"<>]+)"/i);
          const ext = URL_FIXES[slug] || (extMatch ? extMatch[1] : '');
          resolve({ text, url: ext });
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null)).on('timeout', function() { this.destroy(); resolve(null); });
  });
}

async function main() {
  const out = {};
  for (const slug of SLUGS) {
    process.stderr.write(`  ${slug}\n`);
    const data = await fetchSlug(slug);
    if (data?.text) out[slug] = data;
    await new Promise(r => setTimeout(r, 150));
  }
  process.stdout.write(JSON.stringify(out, null, 2) + '\n');
  process.stderr.write(`\nDone: ${Object.keys(out).length}/${SLUGS.length} reviews fetched.\n`);
}

main();

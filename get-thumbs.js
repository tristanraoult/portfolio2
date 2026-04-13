const https = require('https');
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'assets/images/montage');

const videos = [
  { id: 'jfO6E6TVnbM', label: 'Hunger Games' },
  { id: '1Oo5POKiMjw', label: 'Cinématique' },
  { id: '9QkmyyjBZKE', label: 'Kaweko' },
  { id: '4BNwfqb_udI', label: 'Flash Cut' },
  { id: 'qIxzh7ci9qM', label: 'Tousenscène' },
  { id: 'DJnZZSs86KQ', label: 'Hereiam' },
];

// maxresdefault = full HD thumbnail if exists
// sddefault    = 640x480
// hqdefault    = 480x360
// 1, 2, 3      = frames at 25%, 50%, 75% of the video (YouTube auto-stills)
const qualities = ['maxresdefault', 'sddefault', 'hqdefault', '2', '3', '1'];

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => {
        const buf = Buffer.concat(chunks);
        resolve({ status: res.statusCode, data: buf, size: buf.length });
      });
    }).on('error', reject);
  });
}

async function getBest(id) {
  let best = null;
  for (const q of qualities) {
    const url = `https://img.youtube.com/vi/${id}/${q}.jpg`;
    try {
      const res = await download(url);
      if (res.status === 200 && res.size > 4000) {
        if (!best || res.size > best.size) {
          best = { ...res, quality: q };
        }
        // maxresdefault large enough → no need to try others
        if (q === 'maxresdefault' && res.size > 30000) break;
      }
    } catch (_) {}
  }
  return best;
}

(async () => {
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const v of videos) {
    const best = await getBest(v.id);
    if (best) {
      const file = path.join(outDir, v.id + '.jpg');
      fs.writeFileSync(file, best.data);
      console.log(`✓  ${v.label} [${v.id}] — ${best.quality}  (${(best.size / 1024).toFixed(0)} KB)`);
    } else {
      console.log(`✗  ${v.label} [${v.id}] — aucune miniature trouvée`);
    }
  }
  console.log('\nMiniatures enregistrées dans assets/images/montage/');
})();

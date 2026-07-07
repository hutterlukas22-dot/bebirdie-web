/* Link integrity check: every internal href/src must resolve. Run: node check-links.js */
const fs = require('fs');
const files = fs.readdirSync('.').filter((f) => f.endsWith('.html'));
const missing = new Set();
for (const f of files) {
  const html = fs.readFileSync(f, 'utf8');
  const re = /(?:href|src)="([^"#?]+?\.(?:html|css|js|svg))(?:[#?][^"]*)?"/g;
  let m;
  while ((m = re.exec(html))) {
    const t = m[1];
    if (t.startsWith('http') || t.startsWith('data:')) continue;
    if (!fs.existsSync(t)) missing.add(f + ' -> ' + t);
  }
  // also flag empty/# hrefs that are not buttons-by-JS (data-add/data-open allowed)
  const dead = /<a [^>]*href="#"(?![^>]*data-(?:add|open|wish))[^>]*>/g;
  let d;
  while ((d = dead.exec(html))) missing.add(f + ' -> dead href="#": ' + d[0].slice(0, 80));
}
console.log(missing.size ? [...missing].join('\n') : 'OK: all internal links resolve across ' + files.length + ' files');

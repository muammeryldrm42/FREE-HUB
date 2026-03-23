const fs = require('fs');
const path = require('path');
const { ROOT, DATA_DIR, WEB_PUBLIC_DIR } = require('./constants');

fs.mkdirSync(WEB_PUBLIC_DIR, { recursive: true });

const files = [
  path.join(ROOT, 'skills_index.json'),
  path.join(DATA_DIR, 'skills.json'),
  path.join(DATA_DIR, 'categories.json'),
  path.join(DATA_DIR, 'bundles.json'),
  path.join(DATA_DIR, 'workflows.json')
];

for (const file of files) {
  const dest = path.join(WEB_PUBLIC_DIR, path.basename(file));
  fs.copyFileSync(file, dest);
}

console.log(`Synced ${files.length} files to web app public data folder.`);

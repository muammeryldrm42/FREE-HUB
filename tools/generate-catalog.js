const path = require('path');
const { ROOT } = require('./constants');
const { readJson } = require('./lib');

const skills = readJson(path.join(ROOT, 'skills_index.json'));
const grouped = {};
for (const s of skills) {
  grouped[s.category] = grouped[s.category] || [];
  grouped[s.category].push(s);
}

let out = '# Talons Skills Hub Catalog\n\n';
out += `Generated catalog for ${skills.length} skills.\n\n`;

for (const category of Object.keys(grouped).sort()) {
  out += `## ${category}\n\n`;
  for (const s of grouped[category].sort((a, b) => a.name.localeCompare(b.name))) {
    out += `- **${s.name}** (\`${s.slug}\`) — ${s.description}  \n`;
    out += `  Path: \`${s.path}\` · Tools: ${s.supported_tools.join(', ')}\n`;
  }
  out += '\n';
}

require('fs').writeFileSync(path.join(ROOT, 'CATALOG.md'), out);
console.log('Generated CATALOG.md');

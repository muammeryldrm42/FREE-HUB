const fs = require('fs');
const path = require('path');
const { SKILLS_DIR } = require('./constants');

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: null, body: markdown };

  const yaml = match[1];
  const lines = yaml.split('\n');
  const frontmatter = {};
  let currentKey = null;

  for (const line of lines) {
    if (!line.trim()) continue;
    if (/^\s+-\s+/.test(line) && currentKey) {
      frontmatter[currentKey].push(line.replace(/^\s+-\s+/, '').trim());
      continue;
    }
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      const value = kv[2].trim();
      if (value === '') {
        frontmatter[currentKey] = [];
      } else {
        frontmatter[currentKey] = value;
      }
    }
  }

  return { frontmatter, body: markdown.slice(match[0].length) };
}

function getSkillFiles() {
  const dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter((d) => d.isDirectory());
  return dirs.map((dir) => {
    const skillPath = path.join(SKILLS_DIR, dir.name, 'SKILL.md');
    return { slug: dir.name, filePath: skillPath, relPath: path.join('skills', dir.name, 'SKILL.md') };
  }).filter((entry) => fs.existsSync(entry.filePath));
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
}

module.exports = { parseFrontmatter, getSkillFiles, readJson, writeJson };

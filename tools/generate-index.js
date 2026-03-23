const fs = require('fs');
const path = require('path');
const { ROOT, DATA_DIR } = require('./constants');
const { parseFrontmatter, getSkillFiles, writeJson } = require('./lib');

const items = getSkillFiles().map((skill) => {
  const text = fs.readFileSync(skill.filePath, 'utf8');
  const { frontmatter } = parseFrontmatter(text);
  return {
    name: frontmatter.name,
    slug: frontmatter.slug,
    category: frontmatter.category,
    tags: frontmatter.tags,
    description: frontmatter.description,
    supported_tools: frontmatter.supported_tools,
    difficulty: frontmatter.difficulty,
    path: skill.relPath,
    content: text
  };
}).sort((a, b) => a.slug.localeCompare(b.slug));

writeJson(path.join(ROOT, 'skills_index.json'), items);
writeJson(path.join(DATA_DIR, 'skills.json'), items);
console.log(`Generated skills indexes for ${items.length} skills.`);

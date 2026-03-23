const fs = require('fs');
const path = require('path');
const {
  REQUIRED_FRONTMATTER_FIELDS,
  REQUIRED_SECTIONS,
  ALLOWED_CATEGORIES,
  DATA_DIR
} = require('./constants');
const { parseFrontmatter, getSkillFiles, readJson } = require('./lib');

const errors = [];
const seenSlugs = new Set();

for (const skill of getSkillFiles()) {
  const text = fs.readFileSync(skill.filePath, 'utf8');
  if (!text.trim()) {
    errors.push(`${skill.relPath}: file is empty`);
    continue;
  }

  const { frontmatter, body } = parseFrontmatter(text);
  if (!frontmatter) {
    errors.push(`${skill.relPath}: missing frontmatter`);
    continue;
  }

  for (const field of REQUIRED_FRONTMATTER_FIELDS) {
    if (!(field in frontmatter)) {
      errors.push(`${skill.relPath}: missing frontmatter field '${field}'`);
    }
  }

  if (frontmatter.slug !== skill.slug) {
    errors.push(`${skill.relPath}: slug mismatch (frontmatter '${frontmatter.slug}' vs folder '${skill.slug}')`);
  }

  if (seenSlugs.has(frontmatter.slug)) {
    errors.push(`${skill.relPath}: duplicate slug '${frontmatter.slug}'`);
  }
  seenSlugs.add(frontmatter.slug);

  if (!ALLOWED_CATEGORIES.includes(frontmatter.category)) {
    errors.push(`${skill.relPath}: invalid category '${frontmatter.category}'`);
  }

  for (const section of REQUIRED_SECTIONS) {
    if (!body.includes(`# ${section}`)) {
      errors.push(`${skill.relPath}: missing section '# ${section}'`);
    }
  }
}

function validateRefs(fileName, kind) {
  const source = path.join(DATA_DIR, fileName);
  const data = readJson(source);
  const known = new Set([...seenSlugs]);

  for (const item of data) {
    for (const slug of item.skills || []) {
      if (!known.has(slug)) {
        errors.push(`${fileName}: ${kind} '${item.slug}' references unknown skill '${slug}'`);
      }
    }
  }
}

validateRefs('bundles.json', 'bundle');
validateRefs('workflows.json', 'workflow');

if (errors.length > 0) {
  console.error('Validation failed:');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Validation passed for ${seenSlugs.size} skills.`);

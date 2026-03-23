const fs = require('fs');
const path = require('path');
const os = require('os');
const { ROOT, TOOL_DEFAULT_PATHS } = require('./constants');
const { readJson } = require('./lib');

const args = process.argv.slice(2);
const opts = { skills: [], dryRun: false };

for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--dry-run') opts.dryRun = true;
  else if (arg === '--list') opts.list = true;
  else if (arg === '--tool') opts.tool = args[++i];
  else if (arg === '--bundle') opts.bundle = args[++i];
  else if (arg === '--skill') opts.skills.push(args[++i]);
  else if (arg === '--path') opts.path = args[++i];
}

const indexPath = path.join(ROOT, 'skills_index.json');
const skills = fs.existsSync(indexPath) ? readJson(indexPath) : [];
const bundlesPath = path.join(ROOT, 'data', 'bundles.json');
const bundles = fs.existsSync(bundlesPath) ? readJson(bundlesPath) : [];

if (opts.list) {
  console.log('Available skills:');
  for (const s of skills) console.log(`- ${s.slug}`);
  console.log('\nAvailable bundles:');
  for (const b of bundles) console.log(`- ${b.slug}`);
  process.exit(0);
}

if (!skills.length) {
  console.log('No generated index found yet. Run `npm run generate:index` first.');
  process.exit(0);
}

let selected = skills.map((s) => s.slug);
if (opts.bundle) {
  const bundle = bundles.find((b) => b.slug === opts.bundle);
  if (!bundle) {
    console.error(`Unknown bundle: ${opts.bundle}`);
    process.exit(1);
  }
  selected = bundle.skills;
}
if (opts.skills.length > 0) selected = opts.skills;

const target = opts.path
  || (opts.tool && TOOL_DEFAULT_PATHS[opts.tool])
  || TOOL_DEFAULT_PATHS['codex-cli'];

const expanded = target.replace(/^~(?=$|\/|\\)/, os.homedir());

console.log(`Installing ${selected.length} skill(s) to ${expanded}`);
if (opts.tool) console.log(`Target tool profile: ${opts.tool}`);
if (opts.dryRun) {
  console.log('Dry run enabled. No files copied.');
  for (const slug of selected) {
    console.log(`- would copy skills/${slug}/SKILL.md`);
  }
  process.exit(0);
}

fs.mkdirSync(expanded, { recursive: true });
for (const slug of selected) {
  const src = path.join(ROOT, 'skills', slug, 'SKILL.md');
  if (!fs.existsSync(src)) {
    console.error(`Missing skill file for slug: ${slug}`);
    process.exit(1);
  }
  const skillDir = path.join(expanded, slug);
  fs.mkdirSync(skillDir, { recursive: true });
  fs.copyFileSync(src, path.join(skillDir, 'SKILL.md'));
}

console.log('Install complete.');

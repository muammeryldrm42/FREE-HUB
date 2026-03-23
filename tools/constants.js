const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(ROOT, 'skills');
const DATA_DIR = path.join(ROOT, 'data');
const WEB_PUBLIC_DIR = path.join(ROOT, 'apps', 'web-app', 'public', 'data');

const REQUIRED_SECTIONS = [
  'When to use',
  'Inputs',
  'Steps',
  'Output format',
  'Quality checklist',
  'Example invocations',
  'Safety / limitations'
];

const REQUIRED_FRONTMATTER_FIELDS = [
  'name',
  'slug',
  'description',
  'category',
  'tags',
  'supported_tools',
  'difficulty'
];

const ALLOWED_CATEGORIES = [
  'planning',
  'architecture',
  'coding',
  'debugging',
  'testing',
  'security',
  'devops',
  'documentation',
  'ai-engineering',
  'product',
  'performance',
  'refactoring',
  'research'
];

const TOOL_DEFAULT_PATHS = {
  'codex-cli': '~/.codex/skills',
  'claude-code': '~/.claude/skills',
  cursor: '~/.cursor/skills',
  'gemini-cli': '~/.gemini/skills',
  antigravity: '~/.antigravity/skills'
};

module.exports = {
  ROOT,
  SKILLS_DIR,
  DATA_DIR,
  WEB_PUBLIC_DIR,
  REQUIRED_SECTIONS,
  REQUIRED_FRONTMATTER_FIELDS,
  ALLOWED_CATEGORIES,
  TOOL_DEFAULT_PATHS
};

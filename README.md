# Talons Skills Hub

Talons Skills Hub is an original, installable AI skills platform for engineering assistants (Codex CLI, Claude Code, Cursor, Gemini CLI, and similar tools). It now also includes an Open Claw-style `agents/` layer for assistant-specific bootstrap profiles.

## Why this exists
Teams need reusable, validated operating playbooks—not loose prompt snippets. Talons Skills Hub ships a canonical `skills/` library, installer CLI, metadata generation, docs, and a static browser app.

## Project structure
- `skills/`: canonical skill definitions (`skills/<slug>/SKILL.md`)
- `agents/`: assistant-specific profile templates (`agents/<tool>/...`)
- `tools/`: installer, validation, catalog/index generation scripts
- `data/`: bundles, workflows, categories, generated `skills.json`
- `apps/web-app/`: Vite + React static browser app
- `docs/`: user, contributor, maintainer, and source/licensing docs

## Quick install
```bash
npm install
npm run generate
npm run install -- --tool codex-cli
```

## Browse skills
- CLI listing: `npm run install -- --list`
- Web app:
  ```bash
  npm run app:install
  npm run app:dev
  ```


## Open Claw-style bootstrap
For teams that want a ready-to-run assistant setup, this repo now ships:
- Root `AGENTS.md` contributor/agent contract
- Assistant profile templates in `agents/`
- A migration skill: `skills/open-claw-repo-bootstrap/SKILL.md`

Read `docs/users/open-claw-mode.md` for setup guidance.

## Bundles and workflows
Bundles are install presets (Starter Developer, AI Engineer, Debugging, Security, MVP Builder, Documentation). Workflows map multi-skill paths for common jobs.

## Local development
```bash
npm run validate
npm run generate
npm run build:all
```

## GitHub Pages deployment
1. Push repository to GitHub.
2. Enable Pages using GitHub Actions.
3. Run `pages.yml` workflow; app is built with static data from `public/data`.

## Agent API for GitHub Pages
GitHub Pages is static, so AI assistant calls should go through a serverless API.
This repository includes a ready Cloudflare Worker in `apps/agent-api/`.

Quick start:
```bash
npm --prefix apps/agent-api install
npx --prefix apps/agent-api wrangler secret put OPENAI_API_KEY
npx --prefix apps/agent-api wrangler secret put CLIENT_API_KEY
npm --prefix apps/agent-api run deploy
```

Then configure web app env (see `apps/web-app/.env.example`):
```bash
VITE_AGENT_API_URL=https://<your-worker-domain>/chat
VITE_AGENT_PUBLIC_KEY=<CLIENT_API_KEY>
```

Guide: `docs/users/github-pages-agent-api.md`

## Contributing
Read `CONTRIBUTING.md`, `docs/contributors/quality-bar.md`, and `docs/contributors/skill-template.md`.

## Roadmap
- Expand to 1,000+ skills with stronger taxonomy.
- Add skill rating and usage analytics via static telemetry exports.
- Add translation-ready metadata.

## License notes
Code license: `LICENSE` (MIT). Skill content license: `LICENSE-CONTENT` (CC BY 4.0). All implementation/content in this repository is original.

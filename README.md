# Talons Skills Hub

Talons Skills Hub is an original, installable AI skills platform for engineering assistants (Codex CLI, Claude Code, Cursor, Gemini CLI, and similar tools).

## Why this exists
Teams need reusable, validated operating playbooks—not loose prompt snippets. Talons Skills Hub ships a canonical `skills/` library, installer CLI, metadata generation, docs, and a static browser app.

## Project structure
- `skills/`: canonical skill definitions (`skills/<slug>/SKILL.md`)
- `tools/`: installer, validation, catalog/index generation scripts
- `data/`: bundles, workflows, categories, generated `skills.json`
- `apps/web-app/`: Vite + React static browser app
- `docs/`: user, contributor, maintainer, and source/licensing docs

## Quick install
```bash
npm install
npm run generate
npm run install -- --list
npm run install -- --tool codex-cli --all --dry-run
npm run install -- --tool codex-cli --all
```

## Browse skills
- CLI listing: `npm run install -- --list`
- Web app:
  ```bash
  npm run app:install
  npm run app:dev
  ```

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

## Contributing
Read `CONTRIBUTING.md`, `docs/contributors/quality-bar.md`, and `docs/contributors/skill-template.md`.

## Roadmap
- Expand to 1,000+ skills with stronger taxonomy.
- Add skill rating and usage analytics via static telemetry exports.
- Add translation-ready metadata.

## License notes
Code license: `LICENSE` (MIT). Skill content license: `LICENSE-CONTENT` (CC BY 4.0). All implementation/content in this repository is original.


## Pages routing note
The web app uses hash-based routing for reliable GitHub Pages deep-link support.

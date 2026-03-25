# Open Claw Mode

This repository supports an Open Claw-style operating model: shared skills + assistant-specific agent profiles.

## What was added
- Root guidance in `AGENTS.md`
- Per-assistant templates in `agents/`
- Bootstrap skill in `skills/open-claw-repo-bootstrap/SKILL.md`

## Quick start
1. Pick your assistant profile from `agents/` and copy/adapt it into your runtime environment.
2. Install desired skills with the installer:
   ```bash
   npm run install -- --tool codex-cli
   ```
3. Keep generated data fresh after skill changes:
   ```bash
   npm run validate
   npm run generate
   ```

## Recommended workflow
- Start from `open-claw-repo-bootstrap` when setting up a new repository.
- Compose with additional skills from bundles/workflows for your task.
- Keep agent instructions short and delegate detailed execution patterns to skills.

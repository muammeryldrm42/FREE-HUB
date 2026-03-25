# AGENTS.md

This repository is maintained as an **Open Claw-style skills and agents hub**.

## Mission
Ship reusable, tool-agnostic AI operating assets that can be installed quickly:
- `skills/` for reusable playbooks
- `agents/` for drop-in assistant profiles/instructions
- `data/` for generated catalog/index artifacts
- `docs/` for user and maintainer guidance

## Working agreement for contributors/agents
1. Keep skill files in `skills/<slug>/SKILL.md` with valid YAML frontmatter.
2. Prefer additive, composable instructions over monolithic prompts.
3. Keep assistant-specific guidance under `agents/<assistant>/`.
4. After changing `skills/` metadata, run:
   - `npm run validate`
   - `npm run generate`
5. Keep docs and generated public app data in sync.

## Definition of done
- Changes are validated with local scripts.
- New assets are discoverable from README/docs.
- Naming is consistent across skill slug, folder, and docs references.

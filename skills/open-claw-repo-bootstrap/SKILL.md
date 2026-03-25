---
name: Open Claw Repo Bootstrap
slug: open-claw-repo-bootstrap
description: Upgrade a repository into an Open Claw-style agents + skills layout with consistent docs and validation steps.
category: planning
tags:
  - workflow
  - repository
  - agents
  - skills
supported_tools:
  - claude-code
  - cursor
  - codex-cli
  - gemini-cli
difficulty: beginner
---

# When to use
Use this skill when you want to modernize a repo so it includes both reusable skills and assistant-specific agent profiles.

# Inputs
- Current repository structure
- Target assistants/tools to support
- Required docs and validation commands

# Steps
1. Inspect repository for existing `skills/`, docs, and generated data flow.
2. Add/update root guidance (`AGENTS.md`) to define contributor and agent behavior.
3. Add assistant-specific profiles under `agents/` (Codex, Claude, Cursor, Gemini as needed).
4. Add or update one migration/bootstrap skill that documents the upgrade workflow.
5. Update README/docs so new assets are discoverable.
6. Run validation and generation commands to keep indices/catalogs in sync.

# Output format
- **Changes**: list of files created/updated
- **Validation**: commands and outputs
- **Follow-ups**: optional next improvements

# Quality checklist
- Agent files are present and readable.
- New skill has valid frontmatter.
- README/docs mention agents and migration path.
- Validation scripts pass.

# Example invocations
- "Use open-claw-repo-bootstrap to prepare this repo for Codex + Cursor + Claude."
- "Run open-claw-repo-bootstrap and add agent templates plus docs updates."

# Safety / limitations
This skill standardizes structure and process. It does not guarantee security review, legal review, or runtime compatibility with every AI tool version.

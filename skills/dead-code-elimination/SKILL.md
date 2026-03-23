---
name: Dead Code Elimination
slug: dead-code-elimination
description: Dead Code Elimination playbook for AI assistants to produce production-ready outcomes with explicit checks.
category: refactoring
tags:
  - refactoring
  - maintainability
  - cleanup
supported_tools:
  - claude-code
  - cursor
  - codex-cli
  - gemini-cli
difficulty: advanced
---

# When to use
Use this skill when you need dead code elimination for an engineering task and want deterministic, reviewable output.

# Inputs
- Goal and success metrics
- Repository or system context
- Constraints (time, risk, dependencies)
- Non-goals and exclusions

# Steps
1. Restate objective and constraints in one paragraph.
2. Inspect current artifacts, code, or docs before proposing changes.
3. Produce a prioritized plan with explicit trade-offs.
4. Execute in small verifiable increments with checks after each increment.
5. Summarize output with risks, follow-ups, and rollback guidance.

# Output format
- **Summary**: what changed and why
- **Plan**: ordered checklist
- **Deliverables**: concrete patches, commands, or docs
- **Validation**: tests/checks run and expected outcomes
- **Risks**: open issues and mitigations

# Quality checklist
- Objective mapped to outputs
- Assumptions explicit
- Trade-offs documented
- Validation commands included
- Safety/privacy constraints respected

# Example invocations
- "Use dead-code-elimination to plan this feature delivery."
- "Run dead-code-elimination against this module and provide concrete next steps."

# Safety / limitations
This skill improves structure but does not replace domain experts, legal review, or production approvals.
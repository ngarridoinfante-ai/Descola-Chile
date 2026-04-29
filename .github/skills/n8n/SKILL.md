---
name: n8n
description: "Use when working with n8n workflows, nodes, expressions, webhooks, credentials, and automation debugging. Trigger for requests like: n8n, flujo, workflow, node, webhook, automation, JSON schema, retry, error handling."
---

# n8n Skill

## Purpose
Use this skill to design, review, and improve n8n automations with reliable error handling, clear data mapping, and production-ready workflow structure.

## When To Use
- Building new n8n workflows from business requirements.
- Refactoring existing flows for readability and maintenance.
- Debugging failed runs, bad mappings, or broken expressions.
- Adding webhook triggers, API integrations, and credential-safe setups.
- Hardening automations with retries, branching, and fallback paths.

## Workflow
1. Clarify trigger, input data, and expected output.
2. Draft the node sequence (trigger, transform, action, notifications).
3. Define data contracts between nodes (required fields and formats).
4. Implement mapping with explicit expressions and null checks.
5. Add resilience: retries, timeout handling, error branches, and alerts.
6. Validate with sample payloads and edge cases.
7. Document runbook notes for operations and maintenance.

## Best Practices
- Keep each workflow focused on one business goal.
- Prefer small helper sub-workflows over one monolithic flow.
- Normalize data early with Set or Code nodes.
- Guard every external call with error branches.
- Do not hardcode secrets; always use credentials.
- Use deterministic naming for nodes and workflows.
- Add lightweight observability (status updates, error notifications).

## Debug Checklist
- Confirm trigger payload fields exist before mapping.
- Check expression paths and data types at each hop.
- Inspect execution logs for the first failing node.
- Validate API auth, rate limits, and response schemas.
- Re-run with controlled test data for reproducibility.

## Output Style
When using this skill, provide:
- A proposed workflow layout (node-by-node).
- Exact mapping expressions for critical fields.
- Error-handling strategy (retry, catch, notify, fallback).
- Test cases (happy path plus edge cases).
- Deployment notes (credentials, environment variables, monitoring).

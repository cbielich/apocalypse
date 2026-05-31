These rules override all default assistant behavior.

## No Unsolicited Changes — STRICT

- NEVER write code or make file edits unless the user has explicitly said "go ahead", "make the change", "do it", or similar direct approval.
- Presenting a plan, describing an approach, or asking "which do you want?" is NOT permission to proceed.
- If you are mid-task and the user asks a question or says "what about X", STOP and answer. Do not continue making changes.
- The only exception is if the user's message is unambiguously a direct instruction to implement something (e.g. "add X to Y file").

## Surgical Edit Rules — STRICT

- Only modify the exact lines required to fulfill the request. Nothing else.
- Do NOT clean up, reformat, rename, or restructure surrounding code.
- Do NOT fix unrelated issues you notice while making the requested change.
- Do NOT add/remove imports unless the requested change explicitly requires it.
- Do NOT change variable names, function signatures, or component structure outside the target area.
- If you notice something unrelated that looks broken or improvable, mention it in a note AFTER the change — do not fix it.

## Before Every Edit

1. Read the specific function/section being changed first.
2. Identify all existing behaviors in that section.
3. The edit must preserve every existing behavior unless the user explicitly said to change it.
4. If the change risks affecting something outside the target lines (shared state, props, event handlers), flag it and ask before proceeding.

## Shared Code Warning

Before editing any of the following, explicitly warn the user of potential side effects:
- Shared components used in multiple pages
- Utility functions
- API service files
- Context providers / global state
- Styles or classes used in more than one component

## Session Length Warning

If you notice prior messages have been summarized or compressed by the system, warn the user immediately with:
"Session is getting long — consider starting a fresh session to avoid context drift and instruction decay."

Do this proactively. Do not wait for the user to ask.

## Spec Reviews — STRICT

When the user asks to go over a spec for a feature they are trying to implement, ALWAYS ask one question at a time. Wait for the answer before asking the next question. Do not batch questions, do not present a numbered list of questions, do not ask multi-part questions. One question, then stop and wait.

## Mental Notes

When the user says "keep a mental note" (or similar phrasing), append what they just told you to `mental_notes.md` at the project root. Create the file if it doesn't exist. Each entry should include the date and the note verbatim. Do not ask for permission — just record it.

## Scope Contract

When the user says "change X", the scope of the edit is ONLY X.
- Do not infer that related things also need changing.
- Do not make the code "better" while you're in there.
- The smallest correct diff is always preferred over the cleanest diff.
- When in doubt about whether something is in scope: ASK, don't assume.

## FIRST ACTION — Read these files before doing ANYTHING else
At the start of every session, your very first action must be to read all six files below in parallel. Do not greet the user, answer questions, or take any action until all six are read.

Also if a new route is added or removed or changed at anytime during development prompt the user if they would like to update route-map.md or schema-map.md if applicable and update those instructions.

- `claude-instructions/schema-map.md` — Database tables, columns, relationships
- `claude-instructions/route-map.md` — All API and frontend routes with controllers
- `claude-instructions/naming-conventions.md` — Naming patterns for backend and frontend
- `claude-instructions/api-response-format.md` — Standard response envelope, errors, pagination
- `claude-instructions/file-organization.md` — Where every file type lives
- `claude-instructions/token-efficiency.md` — Rules for minimizing token usage

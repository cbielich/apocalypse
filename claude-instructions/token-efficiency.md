# Token Efficiency Guide

## File Reading Strategy

### Before Reading Any File
1. Use Grep to find the exact line numbers of the target code
2. Read only the relevant range (50 lines max around the target)
3. Never read an entire file unless the change affects the whole file

### Large Files (>300 lines) — Always Use Targeted Reads
_TBD — list known large files as they appear so they can be navigated by line range, not whole-file reads._

### Skip Zones (Never Load)
_TBD — list any sections of files that are known to be huge and unrelated to most changes (long HTML templates, generated blobs, etc.)._

## Response Strategy

### Always
- Return diffs only, never full files
- No summaries, no explanations of what was done
- No re-explaining architecture or decisions
- Acknowledge-only responses for yes/no questions (10 words max)
- Batch all clarifying questions in one message

### Never
- Return full file contents unless explicitly asked
- Add comments, docs, or type annotations to unchanged code
- Suggest alternatives, refactors, or improvements unprompted
- Generate tests unless asked
- Re-explain the tech stack or prior decisions

## Lookup Before Read

### Finding a Function / Component
1. `Grep` for the function name to get file + line number
2. Read only that range
3. Do NOT read the whole file

### Finding a Route
- Reference `claude-instructions/route-map.md` — do not re-read the routes file

### Finding a Model's Fields / Relations
- Reference `claude-instructions/schema-map.md` — do not re-read model files

### Finding Where a Component Lives
- Reference `claude-instructions/file-organization.md` — do not scan directories

### Finding API Response Format
- Reference `claude-instructions/api-response-format.md` — do not re-read controllers

### Finding Naming Patterns
- Reference `claude-instructions/naming-conventions.md` — do not scan codebase

## Multi-File Changes
- Confirm scope before starting
- Process files sequentially — do not load all at once
- Grep each file for target lines, read narrow range, produce diff, move to next

## Context Window Protection
- Do not load large files into context "just in case"
- If you need info from 2 sections of a large file, make 2 targeted reads
- Prefer referencing instruction files over re-reading source files for structural info

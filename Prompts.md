# Daily Closed Groups Update Prompt (alt-static)

Please run the Daily Closed Groups Update for my alt-static site.

Scope:
- Work only inside alt-static.
- Read the FIFA pages I shared in this chat:
  - Standings page
  - Scores/fixtures page
- Detect which groups became finalized since the last update.

Required updates:
1. Data source of truth
- Update winners by group in alt-static/live-data.js OFFICIAL_LEADERS.
- Update FINALIZED_GROUPS to include all newly finalized groups.
- Keep scoring centralized via ACTUAL_RESULTS and calcPoints (no duplicated scoring logic).

2. Predictions page
- In alt-static/predictions.html:
  - Group Winners table: color finalized-group picks green if correct, orange if wrong.
  - All Cards: keep official points for Group Winners and Total in sync with centralized scoring.
  - Keep winner chips green/orange for finalized groups.
  - Do not add separate Live Points block.

3. Results page preview
- Update alt-static/results.html so it reflects the newly finalized groups (still not linked from other pages unless I ask).

4. Fun facts for newly closed groups
- Add short fun facts for each newly finalized group (for example: most-picked winner %, surprise winner, perfect predictors count, toughest group).
- Keep tone playful but concise.
- Place fun facts where they are already shown, or add a clearly labeled section in the live/scoreboard experience if needed.

5. Validation
- Run a quick consistency check and report exactly what changed:
  - finalized groups before vs after
  - winners changed
  - files edited
  - any assumptions or ambiguous standings resolved
- JS safety check (important):
  - Do not redeclare top-level const FINALIZED_GROUPS in stats.html (live-data.js already defines it globally).
  - If a local fallback is needed in stats.html, use a different local name such as FINALIZED_GROUPS_LOCAL.
  - Confirm stats.html renders and is not blank after edits.

6. Safe rendering gate (must pass before done)
- Open and verify these pages render non-empty content:
  - alt-static/index.html
  - alt-static/predictions.html
  - alt-static/stats.html
  - alt-static/live-results.html
  - alt-static/results.html
- For each page, confirm:
  - no fatal JavaScript error blocks rendering
  - main content container exists and has visible child content
  - key data section is populated (table, cards, chart, or tiles)
- If any page is blank or partially broken:
  - stop and fix before finalizing
  - re-run the same checks on all pages
- In the final report, include a SAFE CHECK result line per page:
  - PASS or FAIL
  - one short note on what was verified

Optional short trigger you can use with me:
Run Daily Closed Groups Update now (same rules as last time).

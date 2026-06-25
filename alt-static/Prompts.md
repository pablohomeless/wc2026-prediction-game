# Prompt: Update Prediction Game for Finalized Groups

## Usage
When groups D, E, F, G, H, I, J, K, L finalize, replace `['A', 'B', 'C']` with the newly finalized groups and run this prompt.

---

## Prompt Template

**Update FIFA World Cup 2026 Prediction Game — Finalized Groups [INSERT_GROUPS_HERE]**

Groups [INSERT_GROUPS_HERE] have now finalized. Please update the alt-static site to reflect this:

### 1. Update `live-data.js` OFFICIAL_LEADERS
- Verify the finalized group winners from FIFA
- Update the `OFFICIAL_LEADERS` object with the confirmed leaders for [INSERT_GROUPS_HERE]
- Add a comment noting the date and which groups are now finalized

### 2. Color-code predictions in `predictions.html`
- In the JavaScript section (around line 260-270), modify the Group Winners table generation:
  - Update `FINALIZED_GROUPS = ['A', 'B', 'C']` to `FINALIZED_GROUPS = [INSERT_GROUPS_HERE]`
  - This will apply green/orange coloring only to cells for [INSERT_GROUPS_HERE]
- In the "All Cards" section (around line 290+), do the same FINALIZED_GROUPS update

### 3. Highlight finalized groups in `live-results.html`
- In the JavaScript section (around line 280), update `FINALIZED_GROUPS = ['A', 'B', 'C']` to `FINALIZED_GROUPS = [INSERT_GROUPS_HERE]`
- This applies green backgrounds and "✅ Finalized" labels to finalized groups

### 4. Highlight finalized groups in `stats.html` — Group Winners section
- In the JavaScript section (around line 780), update `FINALIZED_GROUPS = ['A', 'B', 'C']` to `FINALIZED_GROUPS = [INSERT_GROUPS_HERE]`
- This applies green styling to group cards for finalized groups
- Fun facts section will auto-generate commentary for [INSERT_GROUPS_HERE]

### 5. Sort fun stats: Newest First
- Finalized group commentary should appear at the top of fun-facts grids
- No additional changes needed — already implemented

### Result
After these updates, the site will:
- ✅ Show finalized groups with green styling across all pages
- ✅ Color-code predictions (green for correct, orange for wrong) for [INSERT_GROUPS_HERE]
- ✅ Generate contextualized commentary (Textbook Call, Split Decision, Believers Won Big, or Majority Lost) for each finalized group
- ✅ Display newest updates first in fun stats

---

## Quick Reference: Group Letters
- **Groups A, B, C**: Finalized (2026-06-25)
- **Groups D, E, F**: Finalize after their matches
- **Groups G, H, I**: Finalize after their matches
- **Groups J, K, L**: Finalize after their matches

## Files to Modify
1. `live-data.js` — Update OFFICIAL_LEADERS constant
2. `predictions.html` — Update FINALIZED_GROUPS (2 places)
3. `live-results.html` — Update FINALIZED_GROUPS (1 place)
4. `stats.html` — Update FINALIZED_GROUPS (1 place)

**Total changes per update: ~5 replacements of the FINALIZED_GROUPS array**

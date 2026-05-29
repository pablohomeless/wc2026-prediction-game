<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/_layout.php';

auth_start();
layout_head('Rules');
?>

<div class="hero" style="padding:2rem">
    <h1>📋 How to Play</h1>
    <p>Predict match scores and earn points — the more accurate your predictions, the more points you earn!</p>
</div>

<!-- Group Stage Matches -->
<div class="card">
    <div class="card-title">⚽ Group Stage Match Predictions</div>
    <p style="margin-bottom:1rem">Predict the exact score of each group-stage match. Points are awarded per match:</p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem">
        <div class="stat-card">
            <div class="stat-val" style="color:#16a34a">4</div>
            <div class="stat-lbl">Exact score correct</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color:#2563eb">2</div>
            <div class="stat-lbl">Correct winner + goal difference</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color:#d97706">1</div>
            <div class="stat-lbl">Correct winner / draw only</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color:#94a3b8">0</div>
            <div class="stat-lbl">Wrong winner</div>
        </div>
    </div>
    <p class="mt-2 text-small text-muted">
        Note: "goal difference" means you predicted the same margin (e.g. 2–0, 3–1, 4–2 all have +2 difference).
        A draw is recognised when both teams score the same.
    </p>
</div>

<!-- Bonus Matches -->
<div class="card">
    <div class="card-title">⚡ Bonus Matches <span class="badge badge-bonus">×3 multiplier</span></div>
    <p>One match per group is designated as a <strong>bonus match</strong>. All points earned for that match are multiplied by <strong>3</strong>.</p>
    <p class="mt-1 text-small text-muted">Maximum: 4 pts × 3 = 12 pts for an exact bonus score.</p>
</div>

<!-- Group Standings -->
<div class="card">
    <div class="card-title">📊 Group Standings Predictions</div>
    <p>Predict the final 1st–4th place finish for each of the 12 groups (A–L).</p>
    <ul style="margin-top:.75rem;padding-left:1.25rem;line-height:2">
        <li><strong>+1 pt</strong> for each team you correctly place in its final group position.</li>
        <li>Maximum <strong>4 pts</strong> per group × 12 groups = <strong>48 pts</strong> total.</li>
    </ul>
</div>

<!-- Special Predictions -->
<div class="card">
    <div class="card-title">⭐ Special Predictions</div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:1rem;margin-bottom:1rem">
        <div class="stat-card">
            <div class="stat-val text-gold">10</div>
            <div class="stat-lbl">🏆 Champion (correct)</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color:#94a3b8">5</div>
            <div class="stat-lbl">🥈 Runner-up (correct)</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color:#cd7f32">2</div>
            <div class="stat-lbl">🥉 3rd place (correct)</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color:#2563eb">5</div>
            <div class="stat-lbl">👟 Golden Boot slot</div>
        </div>
        <div class="stat-card">
            <div class="stat-val" style="color:#2563eb">5</div>
            <div class="stat-lbl">🏅 Golden Ball slot</div>
        </div>
    </div>
    <p class="text-small text-muted">
        Golden Boot &amp; Golden Ball: You can submit up to <strong>3 predictions</strong> for each award.
        You earn +5 pts for each slot where the actual winner appears in your list (e.g. if your 3 boot picks include the real winner you earn 5 pts, regardless of which slot).
        The extra slots let admin award bonus pts to 2nd/3rd award finishers — that's handled via settings.
    </p>
</div>

<!-- Summary -->
<div class="card">
    <div class="card-title">🧮 Maximum Points Summary</div>
    <div class="table-wrap">
    <table class="data-table">
        <thead><tr><th>Category</th><th>Max Points</th></tr></thead>
        <tbody>
            <tr><td>Group stage matches (72 × up to 4 pts)</td><td>288</td></tr>
            <tr><td>Bonus match multiplier extra (12 × up to 8 bonus pts)</td><td>96</td></tr>
            <tr><td>Group standings (12 groups × 4 pts)</td><td>48</td></tr>
            <tr><td>Champion</td><td>10</td></tr>
            <tr><td>Runner-up</td><td>5</td></tr>
            <tr><td>3rd Place</td><td>2</td></tr>
            <tr><td>Golden Boot (up to 3 slots × 5 pts)</td><td>15</td></tr>
            <tr><td>Golden Ball (up to 3 slots × 5 pts)</td><td>15</td></tr>
            <tr><td style="font-weight:700">Grand Total</td><td style="font-weight:700">479</td></tr>
        </tbody>
    </table>
    </div>
</div>

<!-- Tie-breaking -->
<div class="card">
    <div class="card-title">🤝 Tiebreakers</div>
    <p>If two or more players finish with the same total points, tiebreakers are applied in this order:</p>
    <ol style="margin-top:.75rem;padding-left:1.25rem;line-height:2">
        <li>Most points from group-stage matches</li>
        <li>Most points from special predictions</li>
        <li>Most points from group standings</li>
        <li>Alphabetical by display name</li>
    </ol>
</div>

<?php layout_foot(); ?>

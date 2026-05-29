<?php
require_once __DIR__ . '/auth.php';
require_once __DIR__ . '/_layout.php';

auth_start();
layout_head('How to Play');
?>

<div class="hero">
    <div style="font-size:3rem">🎯</div>
    <h1>How to Play</h1>
    <p>Everything you need to know to enter your predictions and earn points</p>
</div>

<!-- Step by step -->
<div class="card">
    <div class="card-title">📋 Step by step</div>
    <ol style="list-style:none;padding:0;counter-reset:steps">
        <?php
        $steps = [
            ['icon'=>'📝','title'=>'Register','body'=>'Click <strong>Register</strong> in the top-right corner, pick a display name and enter your email and a password. Your display name is what appears on the scoreboard, so choose something recognisable.'],
            ['icon'=>'⏰','title'=>'Check the deadline','body'=>'Predictions lock at the date shown in the banner at the top of the Predictions page. Once the deadline passes <strong>no changes are possible</strong>, so don\'t leave it to the last minute.'],
            ['icon'=>'⚽','title'=>'Predict group-stage scores','body'=>'Go to <strong>Predictions → Group Stage</strong>. For each of the 72 group matches enter the score you expect at full time — one number for the home team, one for the away team. You don\'t have to fill all of them in one go; just hit <em>Save Group Stage Predictions</em> every time you want to store your progress.'],
            ['icon'=>'📊','title'=>'Predict group standings','body'=>'Switch to the <strong>Standings</strong> tab. For each of the 12 groups (A–L) drag the four teams into the order you think they will finish. Each correctly-placed team earns you 1 point.'],
            ['icon'=>'⭐','title'=>'Fill in your special picks','body'=>'On the <strong>Special</strong> tab choose the team you think will win the tournament, the runner-up and the 3rd-place finisher. You can also write the names of up to 3 players you think will win the <strong>Golden Boot</strong> (top scorer) and up to 3 for the <strong>Golden Ball</strong> (best player). You only need one of those three slots to be right to earn the points.'],
            ['icon'=>'🔄','title'=>'Wait — and check results','body'=>'Once the tournament starts, visit <strong>Results</strong> at any time to see how matches ended and how many points each result earned you. The <strong>Scoreboard</strong> on the home page updates automatically after the admin enters each result.'],
        ];
        foreach ($steps as $i => $s):
        ?>
        <li style="display:flex;gap:1rem;padding:1rem 0;border-bottom:1px solid #f1f5f9;counter-increment:steps">
            <div style="font-size:2rem;line-height:1;flex-shrink:0"><?= $s['icon'] ?></div>
            <div>
                <div style="font-weight:700;color:#0a1628;margin-bottom:.25rem">
                    Step <?= $i+1 ?> &mdash; <?= $s['title'] ?>
                </div>
                <p style="color:#475569;font-size:.95rem"><?= $s['body'] ?></p>
            </div>
        </li>
        <?php endforeach; ?>
    </ol>
</div>

<!-- Scoring quick-reference -->
<div class="card">
    <div class="card-title">🏆 How points are earned</div>

    <h3 style="font-size:1rem;font-weight:700;color:#0a1628;margin:.75rem 0 .5rem">Match scores</h3>
    <p style="color:#475569;font-size:.9rem;margin-bottom:.75rem">
        Points are awarded per match based on how close your prediction is:
    </p>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:.75rem;margin-bottom:1.25rem">
        <div class="stat-card" style="border-left:4px solid #16a34a">
            <div class="stat-val" style="color:#16a34a">4 pts</div>
            <div class="stat-lbl">Exact score correct</div>
            <div style="font-size:.75rem;color:#94a3b8;margin-top:.25rem">e.g. you said 2–1, it ended 2–1</div>
        </div>
        <div class="stat-card" style="border-left:4px solid #2563eb">
            <div class="stat-val" style="color:#2563eb">2 pts</div>
            <div class="stat-lbl">Right winner + right margin</div>
            <div style="font-size:.75rem;color:#94a3b8;margin-top:.25rem">e.g. you said 2–1, it ended 3–2 (both +1)</div>
        </div>
        <div class="stat-card" style="border-left:4px solid #d97706">
            <div class="stat-val" style="color:#d97706">1 pt</div>
            <div class="stat-lbl">Right winner or draw only</div>
            <div style="font-size:.75rem;color:#94a3b8;margin-top:.25rem">e.g. you said 2–0, it ended 1–0</div>
        </div>
        <div class="stat-card" style="border-left:4px solid #94a3b8">
            <div class="stat-val" style="color:#94a3b8">0 pts</div>
            <div class="stat-lbl">Wrong outcome</div>
            <div style="font-size:.75rem;color:#94a3b8;margin-top:.25rem">e.g. you said a home win, it was a draw</div>
        </div>
    </div>

    <div class="alert alert-info" style="margin-bottom:1rem">
        ⚡ <strong>Bonus match:</strong> One match per group is marked as a <span class="badge badge-bonus">Bonus ×3</span>. Every point you earn for that match is tripled — so an exact score is worth 12 pts instead of 4.
    </div>

    <h3 style="font-size:1rem;font-weight:700;color:#0a1628;margin:.75rem 0 .5rem">Group standings</h3>
    <p style="color:#475569;font-size:.9rem">
        <strong>+1 point</strong> for each team you correctly place in its final group position (1st, 2nd, 3rd or 4th). Maximum 4 pts per group × 12 groups = <strong>48 pts total</strong>.
    </p>

    <h3 style="font-size:1rem;font-weight:700;color:#0a1628;margin:1rem 0 .5rem">Special picks</h3>
    <div class="table-wrap">
    <table class="data-table">
        <thead>
            <tr><th>Pick</th><th>Points if correct</th></tr>
        </thead>
        <tbody>
            <tr><td>🏆 Champion</td><td><strong>10 pts</strong></td></tr>
            <tr><td>🥈 Runner-up</td><td><strong>5 pts</strong></td></tr>
            <tr><td>🥉 3rd Place</td><td><strong>2 pts</strong></td></tr>
            <tr><td>👟 Golden Boot (any of your 3 slots matches the winner)</td><td><strong>5 pts</strong></td></tr>
            <tr><td>🏅 Golden Ball (any of your 3 slots matches the winner)</td><td><strong>5 pts</strong></td></tr>
        </tbody>
    </table>
    </div>
</div>

<!-- FAQ -->
<div class="card">
    <div class="card-title">❓ Frequently asked questions</div>

    <?php $faqs = [
        ['q'=>'Can I change my predictions after saving?',
         'a'=>'Yes — as many times as you like until the deadline. Reload the Predictions page, edit and save again.'],
        ['q'=>'What counts for knockout matches?',
         'a'=>'The score at the end of 90 minutes (regular time). If a knockout match goes to extra time, the score after 120 minutes is used. Penalty shoot-out goals do not count — we look at who\'s ahead after AET.'],
        ['q'=>'Do I need to predict knockout matches separately?',
         'a'=>'In this version only group-stage scores and group standings are entered before the tournament. Knockout bracket predictions are not collected upfront — your points come from the group phase and the special picks.'],
        ['q'=>'What if I forget to save one of the tabs?',
         'a'=>'Each of the three tabs (Group Stage, Standings, Special) has its own Save button. An unsaved tab is silently discarded when the deadline passes, so make sure you save each one.'],
        ['q'=>'What if two players finish with the same points?',
         'a'=>'Tiebreakers in order: (1) most points from group-stage matches, (2) most points from special picks, (3) most points from group standings, (4) alphabetical by display name.'],
        ['q'=>'Can I see other players\' predictions?',
         'a'=>'Not before the deadline. Once predictions are locked, all picks are visible to everyone.'],
    ]; ?>

    <?php foreach ($faqs as $i => $faq): ?>
    <details style="border-bottom:1px solid #f1f5f9;padding:.75rem 0" <?= $i===0?'open':'' ?>>
        <summary style="cursor:pointer;font-weight:600;color:#1e3a5f;list-style:none;display:flex;align-items:center;gap:.5rem">
            <span style="color:#2563eb">›</span> <?= htmlspecialchars($faq['q']) ?>
        </summary>
        <p style="margin-top:.5rem;color:#475569;font-size:.92rem;padding-left:1.25rem"><?= $faq['a'] ?></p>
    </details>
    <?php endforeach; ?>
</div>

<div style="text-align:center;margin-top:1.5rem">
    <?php if (!current_user()): ?>
    <a href="register.php" class="btn btn-gold" style="font-size:1rem;padding:.65rem 2rem">Register &amp; Play ⚽</a>
    <?php else: ?>
    <a href="predictions.php" class="btn btn-gold" style="font-size:1rem;padding:.65rem 2rem">Go to My Predictions ⚽</a>
    <?php endif; ?>
</div>

<?php layout_foot(); ?>

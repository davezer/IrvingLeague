<script>
  import { dues } from '$lib/utils/helper';
</script>

<style>
  :root {
    --panel-soft: #0e1520;
    --brand: #2f7df6;
    --brand-ink: #00316b;
    --ring: rgba(47, 125, 246, 0.35);
    --border: rgba(255,255,255,0.08);
  }

  html { scroll-behavior: smooth; }

  .wrap {
    width: min(1080px, 92vw);
    margin: 7rem auto 8rem;
  }

  /* Layout */
  .grid {
    display: grid;
    gap: 2rem;
    grid-template-columns: 260px 1fr;
  }
  @media (max-width: 900px) {
    .grid { grid-template-columns: 1fr; }
  }

  /* Title */
  .title {
    text-align: center;
    margin-bottom: 2rem;
  }
  .eyebrow {
    color: var(--muted);
    letter-spacing: .12em;
    font-size: .8rem;
    text-transform: uppercase;
  }
  h1 {
    margin: .4rem 0 0;
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    line-height: 1.2;
  }

  /* TOC */
  .toc {
    position: sticky;
    top: 1rem;
    align-self: start;
    background: linear-gradient(180deg, var(--panel), var(--panel-soft));
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1rem;
  }
  .toc h2 {
    font-size: 1rem;
    margin: .25rem 0 0.5rem;
  }
  .toc a {
    display: block;
    padding: .4rem .6rem;
    border-radius: 8px;
    text-decoration: none;
    color: var(--muted);
    transition: background .15s ease, color .15s ease;
  }
  .toc a:hover { background: rgba(255,255,255,0.06); }
  .toc .lvl1 { font-weight: 600; margin-top: .25rem; }
  .toc .lvl2 { margin-left: .75rem; font-size: .95em; }
  .toc .lvl3 { margin-left: 1.5rem; font-size: .9em; }

  /* Mobile TOC accordion */
  details.toc-mobile {
    background: linear-gradient(180deg, var(--panel), var(--panel-soft));
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: .5rem .75rem;
    margin-bottom: 1rem;
  }
  details.toc-mobile summary {
    list-style: none;
    cursor: pointer;
    padding: .5rem .25rem;
    font-weight: 600;
  }
  details.toc-mobile summary::marker { display: none; }
  @media (min-width: 901px) {
    details.toc-mobile { display: none; }
  }

  /* Content */
  .content > section {
    background: linear-gradient(180deg, var(--panel), var(--panel-soft));
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: clamp(1rem, 2.5vw, 1.5rem);
    margin-bottom: 1rem;
    box-shadow: 0 0 0 1px rgba(255,255,255,0.02) inset, 0 8px 28px rgba(0,0,0,0.25);
  }

  .section-title {
    font-size: clamp(1.25rem, 2.2vw, 1.6rem);
    margin: 0 0 .75rem;
  }
  .sub-title {
    font-size: 1.05rem;
    margin: 1.25rem 0 .5rem;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  p { color: var(--muted); margin: .35rem 0 .5rem; }
  ul, ol { margin: .25rem 0 .75rem 1.25rem;}
  li + li { margin-top: .25rem; }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: .5rem 0 .75rem;
    font-size: .95rem;
  }
  td, th {
    padding: .6rem .7rem;
    border-bottom: 1px solid var(--border);
  }
  tr:last-child td { border-bottom: none; }
  td:last-child, th:last-child { text-align: right; }

  /* Back to top */
  .back-top {
    display: inline-flex;
    margin-top: .5rem;
    font-size: .9rem;
    color: var(--brand);
    text-decoration: none;
  }

  /* Chips */
  .chip {
    display: inline-block;
    font-size: .8rem;
    background: rgba(47,125,246,0.12);
    border: 1px solid var(--ring);
    padding: .25rem .55rem;
    border-radius: 999px;
    margin-left: .4rem;
  }
</style>

<div class="wrap">
  <div class="title">
    <div class="eyebrow">Irving Champions League</div>
    <h1>League Constitution</h1>
  </div>

  <!-- Mobile TOC -->
  <details class="toc-mobile">
    <summary>Table of Contents</summary>
    <nav>
      <a class="lvl1" href="#sec-1">Section 1: Roster</a>
      <a class="lvl2" href="#sec-1-1">1.1 Positional Breakdown</a>
      <a class="lvl3" href="#sec-1-1-1">1.1.1 Position Maximums</a>
      <a class="lvl2" href="#sec-1-2">1.2 Trading</a>
      <a class="lvl3" href="#sec-1-2-1">1.2.1 Trade Collusion</a>
      <a class="lvl3" href="#sec-1-2-2">1.2.2 Trade Deadline</a>
      <a class="lvl3" href="#sec-1-2-3">1.2.3 Trade Futures</a>
      <a class="lvl3" href="#sec-1-2-4">1.2.4 Veto/Trade Process</a>
      <a class="lvl2" href="#sec-1-3">1.3 Waiver Wire</a>

      <a class="lvl1" href="#sec-2">Section 2: Drafting</a>
      <a class="lvl2" href="#sec-2-1">2.1 Draft Order</a>
      <a class="lvl2" href="#sec-2-2">2.2 Surplus Budget Rollover</a>
      <a class="lvl2" href="#sec-2-3">2.3 Keeper Rules</a>
      <a class="lvl2" href="#sec-2-4">2.4 Draft Day Trades</a>
      <a class="lvl2" href="#sec-2-5">2.5 Franchise Sale & Bankruptcy</a>

      <a class="lvl1" href="#sec-3">Section 3: Scoring System</a>
      <a class="lvl2" href="#sec-3-1">3.1 Scoring Breakdown</a>
      <a class="lvl2" href="#sec-3-2">3.2 Win/Loss Format</a>
      <a class="lvl2" href="#sec-3-3">3.3 Voting on Scoring</a>

      <a class="lvl1" href="#sec-4">Section 4: Postseason</a>
      <a class="lvl2" href="#sec-4-1">4.1 Playoffs</a>
      <a class="lvl2" href="#sec-4-2">4.2 Tiebreakers</a>
      <a class="lvl2" href="#sec-4-3">4.3 Championship Format</a>

      <a class="lvl1" href="#sec-5">Section 5: Replacing Managers</a>
      <a class="lvl2" href="#sec-5-1">5.1 Removing Managers</a>
      <a class="lvl2" href="#sec-5-2">5.2 Replacing Managers</a>
      <a class="lvl2" href="#sec-5-3">5.3 Replacement Incentive</a>
      <a class="lvl2" href="#sec-5-4">5.4 Franchise Transition</a>

      <a class="lvl1" href="#sec-6">Section 6: League Finances</a>
      <a class="lvl2" href="#sec-6-1">6.1 League Dues</a>
      <a class="lvl2" href="#sec-6-2">6.2 Payout Structure</a>
      <a class="lvl2" href="#sec-6-3">6.3 Auction Futures</a>
    </nav>
  </details>

  <div class="grid">
    <!-- Desktop TOC -->
    <aside class="toc" aria-label="Table of contents">
      <h2>Table of Contents</h2>
      <nav>
        <a class="lvl1" href="#sec-1">Section 1: Roster</a>
        <a class="lvl2" href="#sec-1-1">1.1 Positional Breakdown</a>
        <a class="lvl3" href="#sec-1-1-1">1.1.1 Position Maximums</a>
        <a class="lvl2" href="#sec-1-2">1.2 Trading</a>
        <a class="lvl3" href="#sec-1-2-1">1.2.1 Trade Collusion</a>
        <a class="lvl3" href="#sec-1-2-2">1.2.2 Trade Deadline</a>
        <a class="lvl3" href="#sec-1-2-3">1.2.3 Trade Futures</a>
        <a class="lvl3" href="#sec-1-2-4">1.2.4 Veto/Trade Process</a>
        <a class="lvl2" href="#sec-1-3">1.3 Waiver Wire</a>

        <a class="lvl1" href="#sec-2">Section 2: Drafting</a>
        <a class="lvl2" href="#sec-2-1">2.1 Draft Order</a>
        <a class="lvl2" href="#sec-2-2">2.2 Surplus Budget Rollover</a>
        <a class="lvl2" href="#sec-2-3">2.3 Keeper Rules</a>
        <a class="lvl2" href="#sec-2-4">2.4 Draft Day Trades</a>
        <a class="lvl2" href="#sec-2-5">2.5 Franchise Sale & Bankruptcy</a>

        <a class="lvl1" href="#sec-3">Section 3: Scoring</a>
        <a class="lvl2" href="#sec-3-1">3.1 Scoring Breakdown</a>
        <a class="lvl2" href="#sec-3-2">3.2 Win/Loss Format</a>
        <a class="lvl2" href="#sec-3-3">3.3 Voting on Scoring</a>

        <a class="lvl1" href="#sec-4">Section 4: Postseason</a>
        <a class="lvl2" href="#sec-4-1">4.1 Playoffs</a>
        <a class="lvl2" href="#sec-4-2">4.2 Tiebreakers</a>
        <a class="lvl2" href="#sec-4-3">4.3 Championship Format</a>

        <a class="lvl1" href="#sec-5">Section 5: Replacing Managers</a>
        <a class="lvl2" href="#sec-5-1">5.1 Removing Managers</a>
        <a class="lvl2" href="#sec-5-2">5.2 Replacing Managers</a>
        <a class="lvl2" href="#sec-5-3">5.3 Replacement Incentive</a>
        <a class="lvl2" href="#sec-5-4">5.4 Franchise Transition</a>

        <a class="lvl1" href="#sec-6">Section 6: Finances</a>
        <a class="lvl2" href="#sec-6-1">6.1 League Dues</a>
        <a class="lvl2" href="#sec-6-2">6.2 Payout Structure</a>
        <a class="lvl2" href="#sec-6-3">6.3 Auction Futures</a>
      </nav>
    </aside>

    <!-- Content -->
    <main class="content">
      <!-- Section 1 -->
      <section id="sec-1">
        <h2 class="section-title">Section 1: Roster Breakdown</h2>

        <h3 id="sec-1-1" class="sub-title">1.1 Positional Breakdown</h3>
        <p>28 Total Players</p>

        <p><strong>Starters</strong><span class="chip">9</span></p>
        <ul>
          <li>QB</li><li>RB</li><li>RB</li><li>WR</li><li>WR</li>
          <li>TE</li><li>FLEX (RB/WR/TE)</li><li>D/ST</li><li>K</li>
        </ul>

        <p><strong>Bench</strong><span class="chip">6</span></p>
        <p><strong>IR</strong><span class="chip">2</span> (player must be labeled IR or Out)</p>

        <h4 id="sec-1-1-1" class="sub-title">1.1.1 Position Maximums & IR Eligibility</h4>
        <table>
          <tbody>
            <tr><td>QB</td><td>3 active, 5 total</td></tr>
            <tr><td>RB</td><td>20</td></tr>
            <tr><td>WR</td><td>20</td></tr>
            <tr><td>TE</td><td>10</td></tr>
            <tr><td>D/ST</td><td>3</td></tr>
            <tr><td>K</td><td>3</td></tr>
          </tbody>
        </table>
        <p>IR-eligible labels: COVID-19, OUT, SUSPENDED, NA, DNR, HOLDOUT, OPT-OUT, DOUBTFUL.</p>

        <h3 id="sec-1-2" class="sub-title">1.2 Trading</h3>
        <p>Player trades and future draft money are allowed. Trades process immediately and can be reversed if vetoed or if collusion is investigated.</p>

        <h4 id="sec-1-2-1" class="sub-title">1.2.1 Trade Collusion</h4>
        <p>League officials may investigate alleged collusion. Confirmed offenses may result in fines or removal.</p>

        <h4 id="sec-1-2-2" class="sub-title">1.2.2 Trade Deadline</h4>
        <p>Deadline: start of NFL Week 11 games.</p>

        <h4 id="sec-1-2-3" class="sub-title">1.2.3 Trade Futures</h4>
        <ul>
          <li>Futures auction dollars are tradeable in-season only, up to one year forward.</li>
          <li>All GMs must maintain a minimum of $15 auction budget for the following season.</li>
          <li>Maximum draft budget is $300.</li>
        </ul>

        <h4 id="sec-1-2-4" class="sub-title">1.2.4 Veto/Trade Process</h4>
        <ul>
          <li>1-day review for financial compliance.</li>
          <li>Vetoes only for clear collusion.</li>
          <li>Non-compliant trades are denied.</li>
        </ul>

        <h3 id="sec-1-3" class="sub-title">1.3 Waiver Wire</h3>
        <p>System: FAAB blind bid</p>
        <p>Budget: $200 per season (resets annually; not real cash)</p>
        <p>Non-tradeable</p>

        <a class="back-top" href="#top">↑ Back to top</a>
      </section>

      <!-- Section 2 -->
      <section id="sec-2">
        <h2 class="section-title">Section 2: Drafting</h2>

        <h3 id="sec-2-1" class="sub-title">2.1 Draft Order</h3>
        <ul>
          <li>Auction format</li>
          <li>Standard budget: $200</li>
          <li>Max: $300</li>
          <li>Min: $15</li>
        </ul>

        <h3 id="sec-2-2" class="sub-title">2.2 Surplus Budget Rollover</h3>
        <p>Unused auction funds roll into the next season. Surplus is tradeable during the season.</p>

        <h3 id="sec-2-3" class="sub-title">2.3 Keeper Rules</h3>
        <p>Maximum of 2 keepers per GM</p>
        <p>Deadline: 2 days before draft</p>
        <p>Cost basis:</p>
        <ul>
          <li>Drafted player = last auction price + tax</li>
          <li>Waiver player = FAAB cost + tax</li>
          <li>Trade acquisition = original draft cost + tax</li>
          <li>Free Agent = $10 + tax</li>
        </ul>
        <p>Keeper Tax:</p>
        <ul>
          <li>Year 1: +10%</li>
          <li>Year 2: +20%</li>
          <li>Year 3: +30%</li>
        </ul>

        <h3 id="sec-2-4" class="sub-title">2.4 Draft Day Trades</h3>
        <p>Draft-day trades allowed, subject to compliance checks. No futures trades during draft.</p>

        <h3 id="sec-2-5" class="sub-title">2.5 Franchise Sale & Bankruptcy</h3>
        <p>Sale: new owner assumes roster + budget (requires approval).</p>
        <p>Bankruptcy: if abandoned, franchise resets to $200 fresh budget, no keepers.</p>

        <a class="back-top" href="#top">↑ Back to top</a>
      </section>

      <!-- Section 3 -->
      <section id="sec-3">
        <h2 class="section-title">Section 3: Scoring System</h2>

        <h3 id="sec-3-1" class="sub-title">3.1 Scoring Breakdown</h3>
        <p>Standard Half-Point PPR. For live, authoritative details, see the league settings in Sleeper.</p>

        <h3 id="sec-3-2" class="sub-title">3.2 Win/Loss Format</h3>
        <p>Hybrid: Head-to-Head + Top-Half scoring. Weekly results may be 2-0, 1-1, or 0-2.</p>

        <h3 id="sec-3-3" class="sub-title">3.3 Voting on Scoring System</h3>
        <p>Changes require majority approval by league managers.</p>

        <a class="back-top" href="#top">↑ Back to top</a>
      </section>

      <!-- Section 4 -->
      <section id="sec-4">
        <h2 class="section-title">Section 4: Postseason</h2>

        <h3 id="sec-4-1" class="sub-title">4.1 Playoffs</h3>
        <p>Top 6 teams qualify. Top 2 seeds receive a Week 14 bye.</p>

        <h3 id="sec-4-2" class="sub-title">4.2 Playoff Tiebreakers</h3>
        <ol>
          <li>Points For (PF)</li>
          <li>Points Against (PA)</li>
          <li>Coin Flip (if necessary)</li>
          <li>Fight to the death (kidding… probably)</li>
        </ol>

        <h3 id="sec-4-3" class="sub-title">4.3 Championship Round Format</h3>
        <p>Two-week final: combined score for Weeks 16 & 17.</p>

        <a class="back-top" href="#top">↑ Back to top</a>
      </section>

      <!-- Section 5 -->
      <section id="sec-5">
        <h2 class="section-title">Section 5: Replacing Managers</h2>

        <h3 id="sec-5-1" class="sub-title">5.1 Removing Managers</h3>
        <p>Grounds: repeated collusion or failing to set lineups.</p>

        <h3 id="sec-5-2" class="sub-title">5.2 Replacing Managers</h3>
        <p>Commissioner recruits replacements with ties to current GMs.</p>

        <h3 id="sec-5-3" class="sub-title">5.3 Replacement Incentive</h3>
        <p>New managers require league approval.</p>

        <h3 id="sec-5-4" class="sub-title">5.4 Franchise Transition</h3>
        <p>Sale → roster and assets transfer.</p>
        <p>Bankruptcy → fresh $200 budget, no keepers, new team identity.</p>

        <a class="back-top" href="#top">↑ Back to top</a>
      </section>

      <!-- Section 6 -->
      <section id="sec-6">
        <h2 class="section-title">Section 6: League Finances</h2>

        <h3 id="sec-6-1" class="sub-title">6.1 League Dues</h3>
        <p>League dues are set at ${dues}.</p>

        <h3 id="sec-6-2" class="sub-title">6.2 Payout Structure</h3>
        <p>League payout is structured as follows:</p>
        <table>
          <tbody>
            <tr><td>Prize Pool</td><td>$1,400</td></tr>
            <tr><td>1st Place</td><td>$1,000</td></tr>
            <tr><td>2nd Place</td><td>$335</td></tr>
            <tr><td>Parlay Pool</td><td>$65</td></tr>
          </tbody>
        </table>

        <h3 id="sec-6-3" class="sub-title">6.3 Auction Futures</h3>
        <ul>
          <li>Futures tradable <strong>one year forward only</strong>.</li>
          <li>In-season trading only.</li>
          <li>Must maintain $15 draft minimum.</li>
        </ul>

        <a class="back-top" href="#top">↑ Back to top</a>
      </section>
    </main>
  </div>
</div>

<script>
    import { dues } from '$lib/utils/helper';
    let one, oneOne, oneOneOne, oneTwo, oneTwoOne, oneTwoTwo, oneTwoThree, oneTwoFour, oneTwoFive, oneThree;
    let two, twoOne, twoTwo, twoThree;
    let three, threeOne;
    let four, fourOne, fourTwo;
    let five, fiveOne;
    let six, sixOne, sixTwo, sixThree;
    let seven, sevenOne, sevenTwo, sevenThree;

    const goToSection = (section) => {
        const top = section.getBoundingClientRect().top + window.pageYOffset;
        window.scrollTo({left: 0, top, behavior: 'smooth'});
    }
</script>

<style>
    .constitution {
        position: relative;
        z-index: 1;
        width: 92%;
        max-width: 800px;
        margin: 8em auto 10em;
    }

    h1 {
        font-size: 2em;
        line-height: 1.2em;
        text-align: center;
        margin: 2em 0 1.5em;
    }

    h2 {
        font-size: 1.5em;
        line-height: 1.2em;
    }

    h3 {
        text-decoration: underline;
        font-size: 1.3em;
        line-height: 1.2em;
    }

    h4 {
        text-decoration: underline;
        margin-left: 2em;
        font-size: 1.2em;
        line-height: 1.2em;
    }

    h5 {
        margin-left: 6em;
        font-size: 0.8em;
        line-height: 1.1em;
    }

    .subBlock {
        margin-left: 2.4em;
    }

    .sectionHeading {
        margin: 4em 0 1.5em;
    }

    .subSectionHeading {
        margin: 1.5em 0 1.5em;
    }

    .underscore {
        text-decoration: underline;
    }

    .right {
        text-align: right;
    }

    .positionMaximums td {
        min-width: 3em;
    }

    .noUnderscore {
        text-decoration: none;
    }

    .clickable {
        cursor: pointer;
    }

    .clickable:hover {
        color: #00316b;
    }

    p {
        color: #777;
    }
</style>

<div class="constitution">
    <h1 class="noUnderscore">LEGENDS LEAGUE CONSTITUTION</h1>
    
    <h2 class="noUnderscore">TABLE OF CONTENTS</h2>
    
    <button type="button" class="noUnderscore clickable" on:click={() => goToSection(one)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
        <h3 style="margin: 0;">Section 1: Roster</h3>
    </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(oneOne)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">1.1 Positional Breakdown</h4>
        </button>
            <button type="button" class="noUnderscore clickable" on:click={() => goToSection(oneOneOne)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
                <h5 style="margin: 0;">1.1.1 Position Maximums</h5>
            </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(oneTwo)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">1.2 Trading</h4>
        </button>
            <button type="button" class="noUnderscore clickable" on:click={() => goToSection(oneTwoOne)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
                <h5 style="margin: 0;">1.2.1 Trade Collusion</h5>
            </button>
            <button type="button" class="noUnderscore clickable" on:click={() => goToSection(oneTwoTwo)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
                <h5 style="margin: 0;">1.2.2 Trade Deadline</h5>
            </button>
            <button type="button" class="noUnderscore clickable" on:click={() => goToSection(oneTwoThree)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
                <h5 style="margin: 0;">1.2.3 Trade Futures</h5>
            </button>
            <button type="button" class="noUnderscore clickable" on:click={() => goToSection(oneTwoFour)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
                <h5 style="margin: 0;">1.2.4 Veto/Trade Process</h5>
            </button>
            
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(oneThree)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">1.3 Waiver Wire</h4>
        </button>
    
    <button type="button" class="noUnderscore clickable" on:click={() => goToSection(two)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
        <h3 style="margin: 0;">Section 2: Drafting</h3>
    </button>
    
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(twoOne)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">2.1 Draft Order</h4>
        </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(twoTwo)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">2.2 Surplus Budget Rollover</h4>
        </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(twoThree)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">2.3 Keeper Rules</h4>
        </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(twoFour)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">2.4 Draft Day Trades</h4>
        </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(twoFive)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">2.5 Franchise Sale & Bankruptcy</h4>
        </button>
    
    <button type="button" class="noUnderscore clickable" on:click={() => goToSection(three)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
        <h3 style="margin: 0;">Section 3: Scoring System</h3>
    </button>
    
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(threeOne)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">3.1 Scoring Breakdown</h4>
        </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(threeTwo)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">3.2 Win/Loss Format</h4>
        </button>
         <button type="button" class="noUnderscore clickable" on:click={() => goToSection(threeThree)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">3.3 Voting on Scoring System</h4>
        </button>
    
    <button type="button" class="noUnderscore clickable" on:click={() => goToSection(four)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
        <h3 style="margin: 0;">Section 4: Postseason</h3>
    </button>
    
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(fourOne)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">4.1 Playoffs</h4>
        </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(fourTwo)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">4.2 Playoff Tiebreakers</h4>
        </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(fourThree)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">4.3 Championship Round Format</h4>
        </button>

    <button type="button" class="noUnderscore clickable" on:click={() => goToSection(five)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
        <h3 style="margin: 0;">Section 5: Replacing Managers</h3>
    </button>
    
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(fiveOne)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">5.1 Removing Managers</h4>
        </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(fiveTwo)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">5.2 Replacing Managers</h4>
        </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(fiveThree)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">5.3 Replacement Incentive</h4>
        </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(fiveFour)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">5.4 Replacement Process</h4>
        </button>


    <button type="button" class="noUnderscore clickable" on:click={() => goToSection(six)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
        <h3 style="margin: 0;">Section 6: League Finances</h3>
    </button>
    
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(sixOne)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">6.1 League dues</h4>
        </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(sixTwo)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">6.2 Payouts</h4>
        </button>
        <button type="button" class="noUnderscore clickable" on:click={() => goToSection(sixThree)} style="all: unset; cursor: pointer; display: block; width: 100%; text-align: left;">
            <h4 style="margin: 0;">6.3 Auction Futures</h4>
        </button>

       
    
    <hr />
    
    <h2 class="sectionHeading" bind:this={one}>Section 1 Roster Breakdown</h2>
    
    <h3 class="subSectionHeading" bind:this={oneOne}>1.1 Positional Breakdown</h3>
    
    <p>28 Total Players</p>
    
    <p class="underscore">Starters</p>
    <ul>
        <li>QB</li>
        <li>RB</li>
        <li>RB</li>
        <li>WR</li>
        <li>WR</li>
        <li>TE</li>
        <li>FLEX (RB/WR/TE)</li>
        <li>D/ST</li>
        <li>K</li>
    </ul>

    <p>6 Bench Spots</p>

    <p>2 IR spots (Player must be labeled as IR or Out)</p>

        <h4 bind:this={oneOneOne}>1.1.1 Position Maximums & IR Eligibility</h4>

        <div class="subBlock">
            <table class="positionMaximums">
                <tbody>
                <tr><td>QB</td><td class="right">3 active, 5 total</td></tr>
                <tr><td>RB</td><td class="right">20</td></tr>
                <tr><td>WR</td><td class="right">20</td></tr>
                <tr><td>TE</td><td class="right">10</td></tr>
                <tr><td>D/ST</td><td class="right">3</td></tr>
                <tr><td>K</td><td class="right">3</td></tr>
                </tbody>
            </table>
            <p> Players on IR must be labeled as COVID-19, OUT, SUSPENDED, NA, DNR, HOLDOUT, OPT-OUT and DOUBTFUL</p>
        </div>
        

    <h3 class="subSectionHeading" bind:this={oneTwo}>1.2 Trading</h3>
    
    <p>Trading of players and future draft money are allowed. Trades will process immediately and will be reversed if vetoed or under investigation for collusion. Tradable assets include players and future draft money.</p>
    
    <h4 bind:this={oneTwoOne}>1.2.1 Trade Collusion</h4>
    <div class="subBlock">
        <p>League officials reserve the right to investigate any and all allegations of trade collusion. Confirmed offenses may result in financial penalties or removal from the league. Collusion of any kind will not be tolerated.</p>

    </div>

    <h4 bind:this={oneTwoThree}>1.2.2 Trade Deadline</h4>
    <div class="subBlock">
        <p>The deadline is the start of NFL Week 11 games.</p>
    </div>

    <h4 bind:this={oneTwoFour}>1.2.3 Trade Futures</h4>
    <div class="subBlock">
        <ul>
        <li>Futures auction dollars are tradeable in-season only, up to one year forward.</li>
        <li>All GMs must maintain a minimum of $15 auction budget for the following season.</li>
        <li>Maximum draft budget is $300.</li>
        
    </ul>
    </div>
    
    <h4 bind:this={oneTwoFive}>1.2.4 Veto/Trade Process</h4>
    <div class="subBlock">
        <ul>
            <li>Trades are subject to a 1-day review for financial compliance.</li>
            <li>Vetoes are only appropriate in cases of clear collusion.</li>
            <li>Trades failing to meet financial compliance will be automatically denied.</li>
        </ul>
    </div>
    
    
    
    <h3 bind:this={oneThree}>1.3 Waiver Wire</h3>
    
    <p>System: FAAB blind bid</p>

    <p>Budget: $200 per season (resets annually; not real cash)</p>

    <p>Non-Tradeable</p>


    <h2 class="sectionHeading" bind:this={two}>Section 2 Drafting</h2>
    
    <h3 bind:this={twoOne}>2.1 Draft Order</h3>
    <ul>
        <li>Auction format</li>
        <li>Standard budget: $200</li>
        <li>Max: $300</li>
        <li>Min: $15</li>
    </ul>

    <h3 bind:this={twoTwo}>2.2 Surplus Budget Rollover</h3>
    <p>Unused auction funds roll into the next season.</p>

    <p>Surplus is tradeable during the season.</p>

    <h3 bind:this={twoThree}>2.3 Keeper Rules</h3>
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

    <h4 bind:this={twoFour}>2.4 Draft Day Trades</h4>
    <p>Draft-day trades allowed, subject to compliance checks.</p>

    <p>No futures trades during draft.</p>

    <h4 bind:this={twoFive}>2.5 Franchise Sale & Bankruptcy</h4>
    <p>Sale: New owner assumes roster + budget (requires approval).</p>

    <p>Bankruptcy: If abandoned, franchise is reset to $200 fresh budget, no keepers.</p>

    <h2 class="sectionHeading" bind:this={three}>Section 3 Scoring System</h2>

    <h3 bind:this={threeOne}>3.1 Scoring System</h3>
    <p>Standard Half-Point PPR scoring. For complete and up-to-date scoring details—including any adopted changes—please refer directly to the league settings within the Sleeper app. Always rely on the scoring information currently listed there!</p>
    
    <h3 bind:this={threeTwo}>Win/Loss Format</h3>
    <p>Hybrid: Head-to-Head + Top-Half scoring</p>
    <p>Possible weekly results: 2-0, 1-1, or 0-2.</p>

    <h3 bind:this={threeThree}>Voting on Scoring system</h3>
    <p>Any changes to the scoring system must be approved by a majority vote of the league managers.</p>

    <h2 class="sectionHeading" bind:this={four}>Section 4 Postseason</h2>
    
    <h3 bind:this={fourOne}>4.1 Playoffs</h3>
    <p>Top 6 teams will qualify. Top 2 seeds will have a week 14 bye</p>
    
    <h3 bind:this={fourTwo}>4.2 Playoff Tiebreakers</h3>
    <p>If two teams finish with the same record the tiebreakers will go as followed:</p>

    <ol>
        <li>Points For (PF)</li>
        <li>Points Against (PA)</li>
        <li>Coin Flip (if necessary)</li>
        <li>Fight to the death</li>
    </ol>
    <h3 bind:this={fourThree}>4.3 Championship Round Format</h3>
    <p>Two week final matchup. Combined score for weeks 16 and 17</p>

    <h2 class="sectionHeading" bind:this={five}>Section 5 Replacing Managers</h2>
    
    <h3 bind:this={fiveOne}>5.1 Removing Managers</h3>
    <p>Grounds: repeated collusion or failing to set lineups</p>

    <h3 bind:this={fiveTwo}>5.2 Replacing Managers</h3>
    <p>Commissioner recruits replacements with ties to current GMs.</p>

    <h3 bind:this={fiveThree}>5.3 Replacement Incentive</h3>
    <p>New managers require league approval.</p>

    <h3 bind:this={fiveFour}>5.4 Franchise Transition</h3>
    <p>Sale → roster and assets transfer.</p>
    <p>Bankruptcy → fresh $200 budget, no keepers, new team identity.</p>


    <h2 class="sectionHeading" bind:this={six}>Section 6 League Finances</h2>
    
    <h3 bind:this={sixOne}>6.1 League dues</h3>
    <p>League dues are set at {dues}$.</p>

    <h3 bind:this={sixTwo}>6.2 Payout Structure</h3>
    <p>League payout is structured as follows:</p>
    <ul>
        <li>Prize Pool: $1,400</li>
        <li>1st place: $1,000$</li>
        <li>2nd place: $335$</li>
        <li>Parlay Pool: $65</li>
    </ul>

    <h3 bind:this={sixThree}>6.3 Auction Futures</h3>
    <p>Futures tradable <strong>one year forward only</strong>.</p>
    <p>In-season trading only.</p>
    <p>Must maintain $15 draft minimum.</p>


</div>
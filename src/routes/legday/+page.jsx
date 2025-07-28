import {
    getParlay,
} from '$lib/utils/helper';

<head>
    <link rel="stylesheet" href="https://cdn.datatables.net/2.3.2/css/dataTables.css"/>
</head>

export async function load() {
    const parlayData = await getParlay();

    return {
        parlayData
    };
}

<style>
    .pageBody {
        position: relative;
        z-index: 1;
    }

    :global(.list) {
        width: 90%;
        max-width: 800px;
        border: 1px solid
        var(--mdc-theme-text-hint-on-background, var(--d7d7d7));
        margin: 15px auto;
        padding: 0 !important;
        box-shadow: 0px 3px 3px -2px var(--boxShadowOne), 0px 3px 4px 0px var(--boxShadowTwo), 0px 1px 8px 0px var(--boxShadowThree);
    }
    
</style>

<div class="pageBody">
    <div class="banner">
        <h4>Leg Day Parlay</h4>
    </div>
    <table id="parlayStats" class="display">
        <thead>
            <tr>
                <th>GM Name</th>
                <th>GM Team</th>
                <th>Date</th>
                <th>Week</th>
                <th>Group Parlay Bet</th>
                <th>Odds</th>
                <th>Group Parlay Result</th>
                <th>Bet Category 1</th>
                <th>Bet Category 2</th>
            </tr>
        </thead>
    </table>
</div>



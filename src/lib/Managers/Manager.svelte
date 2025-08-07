<script>
    import Button, { Group, Label } from '@smui/button';
    import LinearProgress from '@smui/linear-progress';
    import { loadPlayers, getLeagueTransactions } from '$lib/utils/helper';
    import Roster from '../Rosters/Roster.svelte';
    import TransactionsPage from '../Transactions/TransactionsPage.svelte';
    import { goto } from '$app/navigation';
    import ManagerFantasyInfo from './ManagerFantasyInfo.svelte';
    import ManagerAwards from './ManagerAwards.svelte';
    import { onMount } from 'svelte';
    import {
        getDatesActive,
        getRosterIDFromManagerID,
        getTeamNameFromTeamManagers,
    } from '$lib/utils/helperFunctions/universalFunctions';
    import { fetchPivotData } from '$lib/utils/helperFunctions/fetchPivotData';
    import ManagerDraftMoney from './ManagerDraftMoney.svelte';

    export let manager,
        managers,
        rostersData,
        leagueTeamManagers,
        rosterPositions,
        transactionsData,
        awards,
        records;
    // these two will be populated below onMount
    export let pivot = [];
    export let pivotError = '';
    export let pivotLoading = true;

  onMount(async () => {
    pivotLoading = true;
    try {
      // pass the injected fetch in so SSR + client both work
      pivot = await fetchPivotData(fetch, 'draftMoney');
      console.log('🚀 pivot raw slice:', pivot);
    } catch (err) {
      pivotError = err.message;
    } finally {
      pivotLoading = false;
    }
  });


    export let viewManager;
    export let managerIndex;

    let transactions = transactionsData.transactions;

    $: viewManager = managers[manager];

    $: datesActive = getDatesActive(leagueTeamManagers, viewManager.managerID);

     $: commissioner = viewManager.managerID
        ? leagueTeamManagers.users[viewManager.managerID].is_owner
        : false;

    const startersAndReserve = rostersData.startersAndReserve;
    let rosters = rostersData.rosters;

    $: ({ rosterID, year } = viewManager.managerID
        ? getRosterIDFromManagerID(leagueTeamManagers, viewManager.managerID)
        : { rosterID: viewManager.roster, year: null });

    $: teamName = getTeamNameFromTeamManagers(leagueTeamManagers, rosterID, year);

    $: teamTransactions = transactions.filter((t) =>
        t.rosters.includes(parseInt(rosterID))
    );

    $: roster = rosters[rosterID];

    $: coOwners =
        year && rosterID
            ? leagueTeamManagers.teamManagersMap[year][rosterID].managers
                  .length > 1
            : roster.co_owners;

   

    let players, playersInfo;
    let loading = true;

    const refreshTransactions = async () => {
        const newTransactions = await getLeagueTransactions(false, true);
        transactions = newTransactions.transactions;
    };

    // existing onMount for players & transactions
    onMount(async () => {
        if (transactionsData.stale) {
            refreshTransactions();
        }
        const playerData = await loadPlayers(null);
        playersInfo = playerData;
        players = playerData.players;
        loading = false;

        if (playerData.stale) {
            const newPlayerData = await loadPlayers(null, true);
            playersInfo = newPlayerData;
            players = newPlayerData.players;
        }
    });

    // NEW: fetch the pivot data on mount
 
    const changeManager = (newManager, noscroll = false) => {
    if (!newManager) {
      goto(`/managers`);
    }
    manager = newManager;
    goto(`/manager?manager=${newManager}`, { noscroll });
  };

</script>

<div class="managerContainer">
    <div class="managerConstrained">
        <img class="managerPhoto" src={viewManager.photo} alt="manager" />
        <h2>
            {viewManager.name}
    
            <div class="teamSub">
                {coOwners ? 'Co-' : ''}Manager of
                <i
                    >{getTeamNameFromTeamManagers(
                        leagueTeamManagers,
                        rosterID,
                        year
                    )}</i
                >
            </div>
            
        </h2>
        {#if commissioner}
                    <div class="commissionerBadge">
                        <span>C</span>
                    </div>
                {/if}
        
        <div class="basicInfo">
            <span class="infoChild"
                >{viewManager.location || 'Undisclosed Location'}</span
            >
            {#if viewManager.managerID && datesActive.start}
                <span class="seperator">|</span>
                {#if datesActive.end}
                    <span class="infoChild"
                        >In the league from '{datesActive.start
                            .toString()
                            .substr(2)} to '{datesActive.end
                            .toString()
                            .substr(2)}</span
                    >
                {:else}
                    <span class="infoChild"
                        >Since '{datesActive.start.toString().substr(2)}</span
                    >
                {/if}
            {:else if viewManager.fantasyStart}
                <!-- fantasyStart is an optional field -->
                <span class="seperator">|</span>
                <span class="infoChild"
                    >Playing ff since '{viewManager.fantasyStart
                        .toString()
                        .substr(2)}</span
                >
            {/if}
            <span class="seperator">|</span>
            {#if pivotLoading}
                <span>Loading draft money…</span>
            {:else if pivotError}
                <p class="error">Pivot error: {pivotError}</p>
            {:else}
                <ManagerDraftMoney
                {viewManager}
                {pivot}
                {teamName}
                />
            {/if}

            {#if viewManager.preferredContact}
                <!-- preferredContact is an optional field -->
                <span class="seperator">|</span>
                <span class="infoChild"
                    >{viewManager.preferredContact}<img
                        class="infoChild infoContact"
                        src="/{viewManager.preferredContact}.png"
                        alt="favorite team"
                    /></span
                >
            {/if}
            <!-- <span class="infoChild">{viewManager.preferredContact}</span> -->
            {#if viewManager.favoriteTeam}
                <!-- favoriteTeam is an optional field -->
                <span class="seperator">|</span>
                <img
                    class="infoChild infoTeam"
                    src="https://sleepercdn.com/images/team_logos/nfl/{viewManager.favoriteTeam}.png"
                    alt="favorite team"
                />
            {/if}
            
        </div>
    </div>
</div>
<div class="managerNav upper">
    <Group variant="outlined">
        {#if manager == 0}
            <Button
                disabled
                class="selectionButtons"
                onclick={() => changeManager(parseInt(manager) - 1, true)}
                variant="outlined"
            >
                <Label>Previous Manager</Label>
            </Button>
        {:else}
            <Button
                class="selectionButtons"
                onclick={() => changeManager(parseInt(manager) - 1, true)}
                variant="outlined"
            >
                <Label>Previous Manager</Label>
            </Button>
        {/if}
        <Button
            class="selectionButtons"
            onclick={() => goto('/managers')}
            variant="outlined"
        >
            <Label>All Managers</Label>
        </Button>
        {#if manager == managers.length - 1}
            <Button
                disabled
                class="selectionButtons"
                onclick={() => changeManager(parseInt(manager) + 1, true)}
                variant="outlined"
            >
                <Label>Next Manager</Label>
            </Button>
        {:else}
            <Button
                class="selectionButtons"
                onclick={() => changeManager(parseInt(manager) + 1, true)}
                variant="outlined"
            >
                <Label>Next Manager</Label>
            </Button>
        {/if}
    </Group>
</div>

{#if viewManager.bio}
    <!-- bio is an optional field -->
    <h3>Bio</h3>
    <p class="bio">{@html viewManager.bio}</p>
{/if}

{#if viewManager.tookOver}
    <!-- tookOver is an optional field -->
    <h3>Took Over</h3>
    <p class="bio">{viewManager.tookOver}</p>
{/if}

<!-- <p class="bio">{@html viewManager.bio}</p> -->

{#if viewManager.philosophy}
    <!-- philosophy is an optional field -->
    <h3>Team Philosophy</h3>
    <p class="philosophy">{@html viewManager.philosophy}</p>
{/if}
<ManagerFantasyInfo
    {pivot}
    {viewManager}
    managerIndex={manager}  
    {players}
    {changeManager}
  />

<ManagerAwards
    {leagueTeamManagers}
    tookOver={viewManager.tookOver}
    {awards}
    {records}
    {rosterID}
    managerID={viewManager.managerID}
/>

{#if loading}
    <!-- promise is pending -->
    <div class="loading">
        <p>Retrieving players...</p>
        <LinearProgress indeterminate />
    </div>
{:else}
    <Roster
        division="1"
        expanded={false}
        {rosterPositions}
        {roster}
        {leagueTeamManagers}
        {players}
        {startersAndReserve}
    />
{/if}

<h3>Team Transactions</h3>
<div class="managerConstrained">
    {#if loading}
        <!-- promise is pending -->
        <div class="loading">
            <p>Retrieving players...</p>
            <LinearProgress indeterminate />
        </div>
    {:else}
        <TransactionsPage
            {playersInfo}
            transactions={teamTransactions}
            {leagueTeamManagers}
            show="both"
            query=""
            page={0}
            perPage={5}
        />
    {/if}
</div>

<div class="managerNav">
    <Group variant="outlined">
        {#if manager == 0}
            <Button
                disabled
                class="selectionButtons"
                onclick={() => changeManager(parseInt(manager) - 1)}
                variant="outlined"
            >
                <Label>Previous Manager</Label>
            </Button>
        {:else}
            <Button
                class="selectionButtons"
                onclick={() => changeManager(parseInt(manager) - 1)}
                variant="outlined"
            >
                <Label>Previous Manager</Label>
            </Button>
        {/if}
        <Button
            class="selectionButtons"
            onclick={() => goto('/managers')}
            variant="outlined"
        >
            <Label>All Managers</Label>
        </Button>
        {#if manager == managers.length - 1}
            <Button
                disabled
                class="selectionButtons"
                onclick={() => changeManager(parseInt(manager) + 1)}
                variant="outlined"
            >
                <Label>Next Manager</Label>
            </Button>
        {:else}
            <Button
                class="selectionButtons"
                onclick={() => changeManager(parseInt(manager) + 1)}
                variant="outlined"
            >
                <Label>Next Manager</Label>
            </Button>
        {/if}
    </Group>
</div>

<style>
    .managerContainer {
        width: 100%;
        margin: 2em 0 5em;
    }

    .managerConstrained {
        width: 100%;
        max-width: 800px;
        margin: 0 auto 4em;
    }

    .managerPhoto {
        display: block;
        border-radius: 100%;
        width: 70%;
        max-width: 200px;
        height: auto;
        margin: 0 auto;
        box-shadow: 0 0 8px 4px #aaa;
    }

    h2 {
        text-align: center;
        font-size: 2.8em;
        margin: 1em 0 0em;
        line-height: 1em;
    }

    h3 {
        text-align: center;
        font-size: 1.5em;
        margin: -0.5em 0 -0.5em;

        font-weight: 200;
    }

    .basicInfo {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        align-items: center;
        gap: 1rem;
        flex-direction: row;
        align-content: center;
        padding-top: 14px;
        margin: 30px 0px -64px 49px;
    }
    .basicInfo > * {
        flex: 0 0 auto; /* prevent children from shrinking */
        white-space: nowrap; /* keep text on one line */
    }

    .basicInfo span {
        color: #888;
        font-size: 0.9em;
    }

    .infoChild {
        display: inline-flex; /* behave like .infoSlot but for spans */
        align-items: center;
        font-style: italic;
    }

    .infoContact {
        height: 20px;
        vertical-align: middle;
        padding-left: 1em;
    }

    .infoTeam {
        height: 48px;
    }

  .bio {
  display: block;          /* make it take full width up to max-width */
  max-width: 500px;        /* constrain its width */
  margin: 2em auto;        /* 2em top/bottom, auto left/right ⇒ centered */
  text-align: center;
}

 h3 {
    font-weight: 600;
    text-shadow: 1px 0px 0px gray, 0 0 1em darkgrey;

}

.philosophy {
    margin: 2em 1.5em 2em;
    text-align: center;
    }

    .loading {
        display: block;
        width: 85%;
        max-width: 500px;
        margin: 80px auto;
    }

    .teamSub {
        font-size: 0.4em;
        line-height: 1.5em;
        color: #666;
    }

    .managerNav {
        margin: 4em 0 2em;
        text-align: center;
    }

    .upper {
        margin-top: 0;
    }

    .commissionerBadge {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 15px;
        width: 15px;
        font-weight: 600;
        border-radius: 15px;
        background-color: var(--blueTwo);
        border: 1px solid var(--blueOne);
        margin: -49px 0 0 532px;
        font-size: 10px;
    }

    /* .commissionerBadge span {
        font-style: normal;
        color: #fff;
    } */

    .seperator {
        margin: 0 .5rem;
        color: #666;
        user-select: none;
        font-size: 1.2em;
    }

    /* media queries */
    @media (max-width:935px) {
        :global(.selectionButtons span) {
            font-size: 0.8em;
        }

        .basicInfo {
            height: 30px;
            flex-direction: column;
            align-items: center;
            margin: 31px 29px -21px 41px;
            gap: 0rem;
        }
    }

    @media (max-width: 505px) {
        :global(.selectionButtons span) {
            font-size: 0.8em;
        }
    }

    @media (max-width: 435px) {
        :global(.selectionButtons span) {
            line-height: 1.2em;
            font-size: 0.8em;
        }
    }

    @media (max-width: 450px) {
        .basicInfo {
            height: 20px;
        }

        .basicInfo span {
            font-size: 0.75em;
        }

        .infoTeam {
            height: 30px;
        }
    }

    @media (max-width: 370px) {
        .basicInfo {
            height: 18px;
        }

        .basicInfo span {
            font-size: 0.6em;
        }

        .infoTeam {
            height: 24px;
        }
    }
</style>

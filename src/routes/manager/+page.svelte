<script>
  import LinearProgress from '@smui/linear-progress';
  import { Manager } from '$lib/components';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  export let data;
  const { managers, manager, managersInfo } = data;

  const managerName = data?.viewManager?.teamName || 'ICL';


  onMount(() => {
    if (!managers.length) goto('/');
    if (manager < 0) goto('/managers');
  });

  // helper to normalize string/array/null
  const toYearsArray = (v) =>
    Array.isArray(v)
      ? v
      : typeof v === 'string'
      ? v.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

  // reactively compute years for the currently selected manager
  $: champYears = toYearsArray(managers?.[manager]?.championship?.years);
</script>


<svelte:head>
  <title>Manager | {managerName}</title>
</svelte:head>

<style>
	.main {
		position: relative;
		z-index: 1;
	}
    .loading {
        display: block;
        width: 85%;
        max-width: 500px;
        margin: 80px auto;
    }
</style>

<div class="main">
  {#await managersInfo}
    <div class="loading">
      <p>Retrieving managers...</p>
      <LinearProgress indeterminate />
    </div>
  {:then [rostersData, leagueTeamManagers, leagueData, transactionsData, awards, records]}
    {#if managers.length && manager > -1}
      <Manager
        {awards}
        {records}
        {manager}
        {managers}
        {rostersData}
        {leagueTeamManagers}
        rosterPositions={leagueData.roster_positions}
        {transactionsData}
        byManager={data.byManager}
        champYears={champYears}
        sections={data.sections}         
      />
    {/if}
  {:catch error}
    <p>Something went wrong: {error.message}</p>
  {/await}
</div>
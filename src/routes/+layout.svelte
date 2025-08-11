<!-- __layout.svelte -->
<script>
	import { Nav, Footer } from "$lib/components"
    import { dev } from '$app/environment';
    import { injectAnalytics } from '@vercel/analytics/sveltekit';
    import { page } from '$app/stores';
    $: currentPath = $page.url.pathname;
 
    injectAnalytics({ mode: dev ? 'development' : 'production' });
</script>

<svelte:head>
  {#if currentPath.startsWith('/manager')}
    <title>Manager | Custom Text</title>
  {:else if currentPath.startsWith('/badges')}
    <title>Badges | Custom Text</title>
  {/if}
</svelte:head>

<main>
    <Nav /> <!-- adds the nav (small and large) -->
  
    <slot />

    <Footer /> <!-- adds the footer -->
</main>
<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
    import TopBar from './components/TopBar'

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
<header>
    <TopBar/>
</header>
{@render children()}

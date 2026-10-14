<script lang="ts">
    import Nav from '../components/Nav.svelte'
    import DeploymentsOverview from '../components/DeploymentsOverview.svelte'
    import Listings from './components/Listings.svelte'
</script>

<div class="content-wrapper">
    <Nav />
    <DeploymentsOverview />
    <Listings />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>

<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import TopBar from '../../components/TopBar'
    import AccountList from './components/AccountList.svelte'
    import Chart from './components/Chart.svelte'

    let { data } = $props()
</script>

<div class="content-wrapper">
    {#await data.accounts}
        <p>Loading...</p>
    {:then accounts}
        <div class="mb-21">
            <TopBar />
            <Chart />
            <AccountList {accounts} />
        </div>
        <Dock />
    {/await}
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>

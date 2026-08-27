<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import TopBar from '../../components/TopBar'
    import AccountName from '../../components/AccountName.svelte'
    import AccountList from './components/AccountList.svelte'
    import Chart from './components/Chart.svelte'

    let { data } = $props()
</script>

<div class="content-wrapper">
    <div class="mb-21">
        <TopBar />
        <AccountName account={data.account?.name ?? ''} role={data.user?.role ?? ''} />
        <Chart />
        <AccountList accounts={data.accounts} />
    </div>
    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>

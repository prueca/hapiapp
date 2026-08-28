<!-- svelte-ignore state_referenced_locally -->

<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import TopBar from '../../components/TopBar'
    import AccountName from '../../components/AccountName.svelte'
    import AccountList from './components/AccountList.svelte'
    import Chart from './components/Chart.svelte'
    import search from './search.context.svelte'

    let { data } = $props()

    search.accounts = data.accounts
</script>

<div class="content-wrapper">
    <div class="mb-21">
        <TopBar />
        <AccountName account={data.account?.name ?? ''} role={data.user?.role ?? ''} />
        <Chart />
        <AccountList />
    </div>
    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>

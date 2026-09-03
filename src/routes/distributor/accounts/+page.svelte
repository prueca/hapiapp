<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import TopBar from '../../components/TopBar'
    import AccountName from '../../components/AccountName.svelte'
    import AccountList from './components/AccountList.svelte'
    import Chart from './components/Chart.svelte'
</script>

<div class="content-wrapper">
    <div class="mb-21">
        <TopBar />
        <AccountName />
        <Chart />
        <AccountList />
    </div>
    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>

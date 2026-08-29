<!-- svelte-ignore state_referenced_locally -->

<script lang="ts">
    import { setContext } from 'svelte'
    import Dock from '../../components/Dock.svelte'
    import TopBar from '../../components/TopBar'
    import AccountName from '../../components/AccountName.svelte'
    import AccountList from './components/AccountList.svelte'
    import Chart from './components/Chart.svelte'

    let { data } = $props()

    setContext('auth', {
        user: data.user,
        account: data.account
    })
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

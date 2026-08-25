<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import TopBar from '../../components/TopBar'
    import WelcomeBanner from '../components/WelcomeBanner.svelte'
    import AccountList from './components/AccountList.svelte'

    let { data } = $props()
</script>

<div class="content-wrapper">
    <div class="mb-21">
        <TopBar />
        <WelcomeBanner {data} />
        <AccountList {data} />
    </div>
    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>

<script lang="ts">
    import TopBar from '../../../components/TopBar'
    import Dock from '../../../components/Dock.svelte'
    import TabbedContent from './components/TabbedContent.svelte'
    import Chart from '../../../components/Chart.svelte'
</script>

<div class="content-wrapper">
    <div class="pb-21">
        <TopBar />
        <Chart />
        <TabbedContent />
    </div>
    <Dock />
</div>

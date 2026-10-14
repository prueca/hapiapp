<script lang="ts">
    import ForDeployment from './for-deployment/ForDeployment.svelte'

    let activeTab = $state('1')
</script>

<div class="px-4 md:px-0">
    <div class="mb-2 font-medium">Deployments</div>

    <!-- Tabs -->
    <div class="scrollbar-hide overflow-x-auto">
        <div class="tabs flex-nowrap tabs-sm">
            <!-- for deployment -->
            <label class="tab">
                <input type="radio" name="tabs" bind:group={activeTab} value="1" />
                <span class="px-1 md:px-4">Deploy</span>
            </label>

            <!-- for pullout -->
            <label class="tab">
                <input type="radio" name="tabs" bind:group={activeTab} value="2" />
                <span class="px-1 md:px-4">Pullout</span>
            </label>

            <!-- processing  -->
            <label class="tab">
                <input type="radio" name="tabs" bind:group={activeTab} value="3" />
                <span class="px-1 md:px-4">Processing</span>
            </label>

            <!-- cancelled -->
            <label class="tab">
                <input type="radio" name="tabs" bind:group={activeTab} value="4" />
                <span class="px-2 md:px-4">Cancelled</span>
            </label>

            <!-- pending -->
            <label class="tab">
                <input type="radio" name="tabs" bind:group={activeTab} value="5" />
                <span class="px-2 md:px-4">Pending</span>
            </label>
        </div>
    </div>

    <!-- Content -->
    <div class="content">
        {#if activeTab === '1'}
            <ForDeployment />
        {:else}
            <div>Lorem Ipsum</div>
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .tab {
        @apply mb-4 rounded-lg bg-(--c7) not-last:mr-2 has-checked:bg-(--c1) has-checked:text-(--c7);
    }

    .scrollbar-hide {
        &::-webkit-scrollbar {
            display: none;
        }

        scrollbar-width: none;
    }

    .content {
        @apply rounded-lg border-l-(--c5) bg-(--c6) p-4;
    }
</style>

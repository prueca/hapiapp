<script lang="ts">
    import Deployments from './Deployments/Tabs.svelte'

    let activeTab = $state('1')
</script>

<div class="px-4 md:px-0">
    <div class="mb-2">Deployment Listings</div>

    <!-- Tabs -->
    <div class="scrollbar-hide overflow-x-auto">
        <div class="tabs flex-nowrap tabs-sm">
            <!-- deployments -->
            <label class="tab">
                <input type="radio" name="groups" bind:group={activeTab} value="1" />
                <span class="px-1 md:px-4">Deployments</span>
            </label>

            <!-- subject for pullout -->
            <label class="tab">
                <input type="radio" name="groups" bind:group={activeTab} value="2" />
                <span class="px-1 md:px-4">Subject for Pullout</span>
            </label>

            <!-- pullout  -->
            <label class="tab">
                <input type="radio" name="groups" bind:group={activeTab} value="3" />
                <span class="px-1 md:px-4">Pullout</span>
            </label>
        </div>
    </div>

    <!-- Content -->
    <div class="content">
        {#if activeTab === '1'}
            <Deployments />
        {:else}
            <div class="rounded-lg bg-base-100 p-4">Lorem Ipsum</div>
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .tab {
        @apply mb-4 rounded bg-(--c7) not-last:mr-2 has-checked:bg-(--c1) has-checked:text-(--c7);
    }

    .scrollbar-hide {
        &::-webkit-scrollbar {
            display: none;
        }

        scrollbar-width: none;
    }
</style>

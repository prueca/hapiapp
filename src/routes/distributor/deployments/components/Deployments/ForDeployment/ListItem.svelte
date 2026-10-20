<script lang="ts">
    import _ from 'lodash'
    import moment from 'moment'
    import Icon from '@iconify/svelte'
    import Freezer from './Freezer.svelte'

    let { deployment } = $props()

    let status = $derived(_.startCase(deployment.originStatus))

    let deploymentDate = $derived(moment(deployment.deploymentDate).format('ddd, MMM DD YYYY'))

    let freezerListOpen = $state(false)
</script>

<div class="list-item">
    <div class="details">
        <div class="flex-1 font-semibold">{deployment.destination.name}</div>
        <div class="flex items-center gap-2">
            <div class="status-badge badge badge-xs">{status}</div>
            {#if deployment.overdue}
                <div class="status-badge overdue badge badge-xs">Overdue</div>
            {/if}
        </div>
        <div class="text-xs text-gray-400">{deployment.destination.address}</div>
        <div class="text-xs text-gray-400">{deploymentDate}</div>
    </div>
    <div class="actions">
        <div class="flex items-center">
            <button class="btn py-4 btn-ghost btn-xs">
                <Icon icon="boxicons:calendar-alt" />
            </button>
            <button class="btn py-4 btn-ghost btn-xs">
                <Icon icon="ci:note-edit" />
            </button>
            <button class="btn py-4 btn-ghost btn-xs">
                <Icon icon="boxicons:trash" />
            </button>
        </div>
        <button
            class="toggle-freezer-list btn py-4 btn-xs"
            onclick={() => (freezerListOpen = !freezerListOpen)}
        >
            <Icon icon="carbon:list-boxes" />
            <div class="badge rounded bg-(--c1) badge-sm text-white">
                {deployment.deploymentItems.length}
            </div>
        </button>
    </div>
    <div class="collapse rounded-none" class:collapse-open={freezerListOpen}>
        <div class="collapse-content p-0">
            <div class="flex flex-col gap-2 border-t border-gray-200 p-2">
                {#each deployment.deploymentItems as deploymentItem (deploymentItem.id)}
                    <Freezer {deploymentItem} />
                {/each}
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .list-item {
        @apply relative overflow-hidden rounded-lg bg-white shadow;
    }

    .details {
        @apply flex flex-col gap-2 border-b border-b-gray-200 p-4 pb-4;
    }

    .actions {
        @apply flex items-center justify-between p-2;
    }

    .status-badge {
        @apply mb-1 rounded border-none bg-(--c4) text-white;

        &.overdue {
            @apply bg-(--c1);
        }
    }
</style>

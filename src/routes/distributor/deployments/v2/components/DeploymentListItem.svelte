<script lang="ts">
    import _ from 'lodash'
    import moment from 'moment'
    import Icon from '@iconify/svelte'
    import DeploymentFreezer from './DeploymentFreezer.svelte'

    let { data } = $props()
    let freezerListOpen = $state(false)
    let status = $derived(_.startCase(data.status))
    let deploymentDate = $derived(moment(data.deploymentDate).format('MMM-DD-YYYY ddd'))
</script>

<div class="list-item">
    <div class="details">
        <div class="flex-1 font-semibold">{data.destination.name}</div>
        <div class="status-badge badge badge-xs">{status}</div>
        <div class="text-xs text-gray-400">{data.destination.address}</div>
        <div class="text-xs text-gray-400">{deploymentDate}</div>
    </div>
    <div class="actions">
        <div class="flex items-center">
            <button class="btn rounded-lg py-4 btn-ghost btn-xs">
                <Icon icon="boxicons:calendar-alt" />
            </button>
            <button class="btn rounded-lg py-4 btn-ghost btn-xs">
                <Icon icon="ci:note-edit" />
            </button>
            <button class="btn rounded-lg py-4 btn-ghost btn-xs">
                <Icon icon="boxicons:trash" />
            </button>
        </div>
        <button
            class="toggle-freezer-list btn rounded-lg py-4 btn-xs"
            onclick={() => (freezerListOpen = !freezerListOpen)}
        >
            <Icon icon="carbon:list-boxes" />
            <div class="badge bg-(--c1) badge-sm text-white">{data.deploymentItemCount}</div>
        </button>
    </div>
    <div class="collapse rounded-none" class:collapse-open={freezerListOpen}>
        <div class="collapse-content p-0">
            <div class="flex flex-col gap-2 border-t border-gray-200 p-2">
                <DeploymentFreezer />
                <DeploymentFreezer />
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
        @apply mb-1 rounded-sm border-none bg-(--c1) text-white;
    }
</style>

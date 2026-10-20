<script lang="ts">
    import _ from 'lodash'
    import { getDisplayText } from '$lib/config/account.types'
    import deployment from '../deployment.svelte'
</script>

{#if deployment.destinationAccount}
    <div class="mb-4 rounded bg-gray-50 p-4">
        <div class="flex items-start justify-between">
            <div class="mb-1 font-medium">
                {deployment.destinationAccount.name}
            </div>
        </div>
        <div class="mb-1 text-xs text-gray-400">
            <span>{getDisplayText(deployment.destinationAccount.type)}</span>
            <span class="mx-1">•</span>
            <span>{deployment.destinationAccount.address}</span>
        </div>
    </div>
{/if}

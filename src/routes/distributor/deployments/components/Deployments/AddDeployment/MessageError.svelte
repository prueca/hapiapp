<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import deployment from './deployment.svelte'
</script>

<div class="modal" class:modal-open={deployment.error}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <Icon icon="boxicons:message-circle-exclamation" class="-mt-0.5" width="32" />
                <div>
                    <p class="mb-1 font-medium">Failed to create deployment</p>
                    <p class="mb-1 text-sm">Error: {deployment.error?.code}</p>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button type="button" class="close-btn btn" onclick={() => deployment.reset()}>
                Close
            </button>
        </div>
    </div>
</div>

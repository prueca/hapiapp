<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import deployment from '../../../deployment.svelte'
</script>

<div class="modal" class:modal-open={deployment.success}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <Icon icon="boxicons:message-circle-check" class="-mt-0.5" width="32" />
                <div>
                    <p class="mb-4 font-medium">Deployment created successfully</p>
                    <div class="flex flex-col gap-4">
                        <div>
                            <div class="mb-1 text-xs text-gray-400">Destination Account</div>
                            <div class="text-sm font-medium">
                                {deployment.data?.destinationAccount.name}
                            </div>
                        </div>
                        <div>
                            <div class="mb-1 text-xs text-gray-400">Account Address</div>
                            <div class="text-sm font-medium">
                                {deployment.data?.destinationAccount.address}
                            </div>
                        </div>
                        <div>
                            <div class="mb-1 text-xs text-gray-400">Deployment Date</div>
                            <div class="text-sm font-medium">
                                {deployment.data?.deploymentDate}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button type="button" class="btn" onclick={() => deployment.reset()}>Close</button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>

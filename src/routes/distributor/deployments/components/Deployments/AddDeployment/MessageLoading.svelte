<script lang="ts">
    import deployment from './deployment.svelte'
</script>

<div class="modal" class:modal-open={deployment.loading}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <span class="loading mt-1 loading-lg loading-spinner"></span>
                <div>
                    <p class="mb-1 text-lg font-medium">Creating deployment...</p>
                    <div class="text-sm">Please wait while the deployment is being created.</div>
                </div>
            </div>
        </div>
    </div>
</div>

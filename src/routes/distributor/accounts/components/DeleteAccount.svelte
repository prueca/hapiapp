<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import del from '../delete.context.svelte'
    import accounts from '../accounts.context.svelte'

    let account = $derived.by(() => {
        return _.find(accounts.list, (x) => x.id === del.target)
    })
</script>

<div class="modal" class:modal-open={del.loading}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-4">
                <span class="loading mt-1 loading-xl loading-spinner"></span>
                <div>
                    <p class="mb-1 text-lg font-medium">Deleting account...</p>
                    <div class="text-sm">Please wait while the account is being deleted.</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={del.error}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-4">
                <Icon icon="boxicons:message-circle-exclamation" class="-mt-0.5" width="50" />
                <div>
                    <p class="mb-1 font-medium">Deletion failed</p>
                    <p class="mb-1 text-sm">Error: {del.error?.code}</p>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button class="close-btn btn rounded-lg" onclick={() => del.setOpen(false)}>
                Close
            </button>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={del.success}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-4">
                <Icon icon="boxicons:message-circle-check" class="-mt-0.5" width="50" />
                <div>
                    <p class="mb-1 font-medium">Deleted successfully</p>
                    <p class="mb-1 text-sm">Your account has been deleted</p>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button class="close-btn btn rounded-lg" onclick={() => del.setOpen(false)}>
                Close
            </button>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={del.open}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-4">
                <Icon icon="boxicons:message-circle-question-mark" class="-mt-0.5" width="50" />
                <div>
                    <p class="mb-1 font-medium">Are you sure want to delete this account?</p>
                    <p class="font-normal">{account?.name}</p>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button class="confirm-btn btn rounded-lg" onclick={() => del.proceed()}>
                Confirm
            </button>
            <button class="close-btn btn rounded-lg" onclick={() => del.setOpen(false)}>
                Close
            </button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .close-btn {
        @apply cursor-pointer rounded-lg border-none;
    }
    .confirm-btn {
        @apply cursor-pointer rounded-lg border-none bg-(--c1) text-white;
    }
</style>

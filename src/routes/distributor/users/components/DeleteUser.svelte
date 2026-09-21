<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
    import del from '../delete.context.svelte'
    import users from '../users.context.svelte'
    import { getDisplayText } from '$lib/config/user.roles'

    let user = $derived.by(() => {
        return _.find(users.list, (x) => x.id === del.target)
    })

    let fullName = $derived.by(() => {
        if (!user) return null

        return user.middleName
            ? `${user.firstName} ${user.middleName} ${user.lastName}`
            : `${user.firstName} ${user.lastName}`
    })
</script>

<div class="modal" class:modal-open={del.loading}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <span class="loading mt-1 loading-lg loading-spinner"></span>
                <div>
                    <p class="mb-1 text-lg font-medium">Deleting user...</p>
                    <div class="text-sm">Please wait while the user is being deleted.</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={del.error}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <Icon icon="boxicons:message-circle-exclamation" class="-mt-0.5" width="32" />
                <div>
                    <p class="mb-1 font-medium">Deletion failed</p>
                    <p class="mb-1 text-sm">Error: {del.error?.code}</p>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button class="close-btn btn rounded-lg" onclick={() => del.toggle(false)}>
                Close
            </button>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={del.success}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <Icon icon="boxicons:message-circle-check" class="-mt-0.5" width="32" />
                <div>
                    <p class="mb-1 font-medium">Deleted successfully</p>
                    <p class="mb-1 text-sm">The user has been deleted</p>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button class="close-btn btn rounded-lg" onclick={() => del.toggle(false)}>
                Close
            </button>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={del.open}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <Icon icon="boxicons:message-circle-question-mark" class="-mt-0.5" width="32" />
                <div>
                    <p class="mb-4 font-medium">Are you sure you want to delete this user?</p>
                    <div class="flex flex-col gap-4">
                        <div>
                            <div class="text-xs text-gray-400">Name</div>
                            <div class="text-sm">{fullName}</div>
                        </div>
                        <div>
                            <div class="text-xs text-gray-400">Role</div>
                            <div class="text-sm">{getDisplayText(user?.role as string)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button class="confirm-btn btn" onclick={() => del.proceed()}> Confirm </button>
            <button class="close-btn btn" onclick={() => del.toggle(false)}> Close </button>
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

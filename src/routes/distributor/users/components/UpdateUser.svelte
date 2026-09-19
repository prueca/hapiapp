<!-- svelte-ignore  a11y_missing_attribute -->
<!-- svelte-ignore  a11y_click_events_have_key_events -->
<!-- svelte-ignore  a11y_no_static_element_interactions -->
<script lang="ts">
    import _ from 'lodash'
    import update from '../update.context.svelte'
    import Icon from '@iconify/svelte'
</script>

<div class="modal" class:modal-open={update.open}>
    <div class="modal-box">
        <div class="heading">
            <p class="mb-4 text-xl font-medium">Update user</p>
        </div>
        <div>
            <!-- user role -->
            <fieldset class="fieldset" class:error={update.issues.isAdmin !== null}>
                <legend class="label">Set User Role</legend>
                <div class="flex items-start gap-4 rounded-lg border border-gray-300 p-4">
                    <input
                        id="normal"
                        type="radio"
                        name="role"
                        class="radio"
                        bind:group={update.data.isAdmin}
                        value={false}
                    />
                    <label for="normal" class="-mt-0.5">
                        <div class="text-[16px] font-medium">Normal User</div>
                        <div class="text-sm text-gray-400">Can only view records</div>
                    </label>
                </div>
                <div class="mb-2 flex items-start gap-4 rounded-lg border border-gray-300 p-4">
                    <input
                        id="admin"
                        type="radio"
                        name="role"
                        class="radio"
                        bind:group={update.data.isAdmin}
                        value={true}
                    />
                    <label for="admin" class="-mt-0.5">
                        <div class="text-[16px] font-medium">Admin User</div>
                        <div class="text-sm text-gray-400">Can view, update and delete records</div>
                    </label>
                </div>
            </fieldset>

            <!-- first name -->
            <fieldset class="fieldset" class:error={update.issues.firstName !== null}>
                <label class="label" for="">Enter first name</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="First name"
                    bind:value={update.data.firstName}
                />
                <div class="help-text">
                    {update.issues.firstName}
                </div>
            </fieldset>

            <!-- middle name -->
            <fieldset class="fieldset" class:error={update.issues.middleName !== null}>
                <label class="label" for="">Enter middle name</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Middle name (optional)"
                    bind:value={update.data.middleName}
                />
                <div class="help-text">
                    {update.issues.middleName}
                </div>
            </fieldset>

            <!-- last name -->
            <fieldset class="fieldset" class:error={update.issues.lastName !== null}>
                <label class="label" for="">Enter last name</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Last name"
                    bind:value={update.data.lastName}
                />
                <div class="help-text">
                    {update.issues.lastName}
                </div>
            </fieldset>

            <!-- address -->
            <fieldset class="fieldset" class:error={update.issues.address !== null}>
                <label class="label" for="">Address</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Complete Address"
                    bind:value={update.data.address}
                />
                <div class="help-text">
                    {update.issues.address}
                </div>
            </fieldset>

            <!-- address -->
            <fieldset class="fieldset" class:error={update.issues.phone !== null}>
                <label class="label" for="">Phone</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Phone number"
                    bind:value={update.data.phone}
                />
                <div class="help-text">
                    {update.issues.phone}
                </div>
            </fieldset>
        </div>
        <div class="modal-action">
            <button class="submit-btn btn" onclick={() => null}> Update </button>
            <button class="close-btn btn" onclick={() => update.toggle(false)}> Close </button>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={update.loading}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <span class="loading mt-1 loading-lg loading-spinner"></span>
                <div>
                    <p class="mb-1 text-lg font-medium">Updating user...</p>
                    <div class="text-sm">Please wait while the user is being updated.</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={update.success}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <Icon icon="boxicons:message-circle-check" class="-mt-0.5" width="32" />
                <div>
                    <div class="mb-4">
                        <p class="mb-1 font-medium">User updated successfully</p>
                        <p class="mb-2 text-sm text-gray-400">Changes have been saved.</p>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button class="btn rounded-lg" onclick={() => update.toggle(false)}> Close </button>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={update.error}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <Icon icon="boxicons:message-circle-exclamation" class="-mt-0.5" width="32" />
                <div>
                    <p class="mb-1 font-medium">Failed to update user</p>
                    <p class="mb-1 text-sm">Error: {update.error?.code}</p>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button class="close-btn btn rounded-lg" onclick={() => update.toggle(false)}>
                Close
            </button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .fieldset {
        @apply not-last:mb-4;

        input[type='text'] {
            @apply w-full rounded-lg;
        }

        .help-text {
            @apply hidden text-xs text-(--c1);
        }

        &.error {
            input[type='text'] {
                @apply border-(--c1);
            }

            .help-text {
                @apply block;
            }
        }
    }

    .close-btn {
        @apply cursor-pointer rounded-lg border-none;
    }
    .submit-btn {
        @apply cursor-pointer rounded-lg border-none bg-(--c1) text-white;
    }
</style>

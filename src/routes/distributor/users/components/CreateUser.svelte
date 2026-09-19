<!-- svelte-ignore  a11y_missing_attribute -->
<!-- svelte-ignore  a11y_click_events_have_key_events -->
<!-- svelte-ignore  a11y_no_static_element_interactions -->
<script lang="ts">
    import _ from 'lodash'
    import { onMount } from 'svelte'
    import accounts from '../accounts.context.svelte'
    import create from '../create.context.svelte'
    import AccountOption from './AccountOption.svelte'
    import Skeleton from '../../../components/Skeleton.svelte'
    import Icon from '@iconify/svelte'

    onMount(() => accounts.load())

    let accountSearchInput: HTMLInputElement

    $effect(() => {
        if (create.data.accountId) {
            const account = _.find(accounts.filtered, { id: create.data.accountId })

            if (account) {
                accountSearchInput.value = account.name
            }
        } else {
            accountSearchInput.value = ''
        }
    })

    const selectAccount = (accountId: string) => {
        accountSearchInput.blur()
        create.selectAccount(accountId)
    }

    const showMoreAccounts = () => {
        accountSearchInput.focus()
        accounts.showMore()
    }
</script>

<div class="modal" class:modal-open={create.open}>
    <div class="modal-box">
        <div class="heading">
            <p class="mb-4 text-xl font-medium">Create a user</p>
        </div>
        <div>
            <!-- account selection -->
            <div class="fieldset" class:error={create.issues.accountId !== null}>
                <label class="label" for="">Select account</label>
                <div class="dropdown w-full">
                    <input
                        tabindex="0"
                        class="input w-full rounded-lg"
                        placeholder="Search account..."
                        bind:this={accountSearchInput}
                        bind:value={accounts.query}
                        onkeyup={() => accounts.filter()}
                    />
                    <ul
                        tabindex="-1"
                        class="dropdown-content menu z-10 w-full rounded-lg bg-base-100 p-2 shadow"
                    >
                        {#if accounts.loading}
                            <Skeleton class="h-36 w-full rounded-lg" />
                        {:else}
                            {#each accounts.filtered as item}
                                <AccountOption {item} onclick={() => selectAccount(item.id)} />
                            {/each}
                            {#if accounts.filtered.length < accounts.total}
                                <div class="border-t border-gray-100 pt-2 text-center">
                                    <button
                                        type="button"
                                        class="btn rounded-lg btn-ghost btn-sm"
                                        onclick={() => showMoreAccounts()}
                                    >
                                        Show More
                                    </button>
                                </div>
                            {/if}
                        {/if}
                    </ul>
                </div>
            </div>

            <!-- user role -->
            <fieldset class="fieldset" class:error={create.issues.isAdmin !== null}>
                <legend class="label">Set User Role</legend>
                <div class="mb-2 flex items-start gap-4 rounded-lg border border-gray-300 p-4">
                    <input
                        id="admin"
                        type="radio"
                        name="role"
                        class="radio"
                        defaultChecked
                        bind:group={create.data.isAdmin}
                        value={true}
                    />
                    <label for="admin" class="-mt-0.5">
                        <div class="text-[16px] font-medium">Admin User</div>
                        <div class="text-sm text-gray-400">Can view, update and delete records</div>
                    </label>
                </div>
                <div class="flex items-start gap-4 rounded-lg border border-gray-300 p-4">
                    <input
                        id="normal"
                        type="radio"
                        name="role"
                        class="radio"
                        bind:group={create.data.isAdmin}
                        value={false}
                    />
                    <label for="normal" class="-mt-0.5">
                        <div class="text-[16px] font-medium">Normal User</div>
                        <div class="text-sm text-gray-400">Can only view records</div>
                    </label>
                </div>
            </fieldset>

            <!-- first name -->
            <fieldset class="fieldset" class:error={create.issues.firstName !== null}>
                <label class="label" for="">Enter first name</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="First name"
                    bind:value={create.data.firstName}
                />
                <div class="help-text">
                    {create.issues.firstName}
                </div>
            </fieldset>

            <!-- middle name -->
            <fieldset class="fieldset" class:error={create.issues.middleName !== null}>
                <label class="label" for="">Enter middle name</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Middle name (optional)"
                    bind:value={create.data.middleName}
                />
                <div class="help-text">
                    {create.issues.middleName}
                </div>
            </fieldset>

            <!-- last name -->
            <fieldset class="fieldset" class:error={create.issues.lastName !== null}>
                <label class="label" for="">Enter last name</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Last name"
                    bind:value={create.data.lastName}
                />
                <div class="help-text">
                    {create.issues.lastName}
                </div>
            </fieldset>

            <!-- address -->
            <fieldset class="fieldset" class:error={create.issues.address !== null}>
                <label class="label" for="">Address</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Complete Address"
                    bind:value={create.data.address}
                />
                <div class="help-text">
                    {create.issues.address}
                </div>
            </fieldset>

            <!-- address -->
            <fieldset class="fieldset" class:error={create.issues.phone !== null}>
                <label class="label" for="">Phone</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Phone number"
                    bind:value={create.data.phone}
                />
                <div class="help-text">
                    {create.issues.phone}
                </div>
            </fieldset>
        </div>
        <div class="modal-action">
            <button class="submit-btn btn" onclick={() => create.submit()}> Create </button>
            <button class="close-btn btn" onclick={() => create.toggle(false)}> Close </button>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={create.loading}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <span class="loading mt-1 loading-lg loading-spinner"></span>
                <div>
                    <p class="mb-1 text-lg font-medium">Creating user...</p>
                    <div class="text-sm">Please wait while the user is being created.</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={create.success}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <Icon icon="boxicons:message-circle-check" class="-mt-0.5" width="32" />
                <div>
                    <div class="mb-4">
                        <p class="mb-1 font-medium">User created successfully</p>
                        <p class="mb-2 text-sm text-gray-400">
                            You may now login and update details
                        </p>
                    </div>
                    <div class="flex flex-col gap-4">
                        <div>
                            <div class="mb-1 text-xs text-gray-400">Username</div>
                            <div class="text-sm font-medium">{create.newUser?.username}</div>
                        </div>
                        <div>
                            <div class="mb-1 text-xs text-gray-400">Password</div>
                            <div class="text-sm font-medium">{create.newUser?.password}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button class="btn rounded-lg" onclick={() => create.toggle(false)}> Close </button>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={create.error}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-2">
                <Icon icon="boxicons:message-circle-exclamation" class="-mt-0.5" width="32" />
                <div>
                    <p class="mb-1 font-medium">Failed to create user</p>
                    <p class="mb-1 text-sm">Error: {create.error?.code}</p>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button class="close-btn btn rounded-lg" onclick={() => create.toggle(false)}>
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

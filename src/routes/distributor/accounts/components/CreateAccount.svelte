<script lang="ts">
    import _ from 'lodash'
    import accountTypes from '$lib/config/account.types'
    import create from '../create.context.svelte'
    import Icon from '@iconify/svelte'
</script>

<div class="modal" class:modal-open={create.error}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-4">
                <Icon icon="boxicons:message-circle-exclamation" class="-mt-0.5" width="50" />
                <div>
                    <p class="mb-1 font-medium">Account creation failed</p>
                    <!-- <p class="mb-1 text-sm">{create.error?.message}</p> -->
                    <p class="mb-1 text-sm">Error: {create.error?.code}</p>
                </div>
            </div>
        </div>
        <div class="modal-action">
            <button class="close-btn btn" onclick={() => create.reset()}> Close </button>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={create.loading}>
    <div class="modal-box">
        <div class="heading">
            <div class="flex items-start gap-4">
                <span class="loading mt-1 loading-xl loading-spinner"></span>
                <div>
                    <p class="mb-1 text-lg font-medium">Creating account...</p>
                    <div class="text-sm">You will be redirected upon success.</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="modal" class:modal-open={create.open}>
    <div class="modal-box">
        <div class="heading">
            <p class="mb-4 text-xl font-medium">Create an account</p>
        </div>
        <div>
            <!-- account type -->
            <div class="fieldset" class:error={create.issues.type !== null}>
                <label class="label">Select account type</label>
                <select class="select" bind:value={create.data.type}>
                    <option disabled selected value="">Choose one</option>
                    <option value={accountTypes.DEALER}>
                        {_.upperFirst(accountTypes.DEALER)}
                    </option>
                    <option value={accountTypes.HAPISTORE}>
                        {_.upperFirst(accountTypes.HAPISTORE)}
                    </option>
                </select>
                <div class="help-text">
                    {create.issues.type}
                </div>
            </div>

            <!-- name -->
            <fieldset class="fieldset" class:error={create.issues.name !== null}>
                <label class="label">Enter account name</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Account name"
                    bind:value={create.data.name}
                />
                <div class="help-text">
                    {create.issues.name}
                </div>
            </fieldset>

            <!-- address -->
            <fieldset class="fieldset" class:error={create.issues.address !== null}>
                <label class="label">Enter account address</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Complete address"
                    bind:value={create.data.address}
                />
                <div class="help-text">
                    {create.issues.address}
                </div>
            </fieldset>

            <!-- phone -->
            <fieldset class="fieldset" class:error={create.issues.phone !== null}>
                <label class="label">Enter phone number</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="Contact number"
                    bind:value={create.data.phone}
                />
                <div class="help-text">
                    {create.issues.phone}
                </div>
            </fieldset>

            <!-- isr code -->
            <fieldset class="fieldset" class:error={create.issues.isrCode !== null}>
                <label class="label">Enter ISR Code</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="ISR code"
                    bind:value={create.data.isrCode}
                />
                <div class="help-text">
                    {create.issues.isrCode}
                </div>
            </fieldset>

            <!-- sap code -->
            <fieldset class="fieldset" class:error={create.issues.sapCode !== null}>
                <label class="label">Enter SAP Code</label>
                <input
                    type="text"
                    class="input w-full"
                    placeholder="SAP code"
                    bind:value={create.data.sapCode}
                />
                <div class="help-text">
                    {create.issues.sapCode}
                </div>
            </fieldset>
        </div>
        <div class="modal-action">
            <button class="submit-btn btn" onclick={() => create.submit()}> Submit </button>
            <button class="close-btn btn" onclick={() => create.toggle()}> Close </button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .fieldset {
        @apply not-last:mb-4;

        select,
        input[type='text'] {
            @apply w-full rounded-lg;
        }

        .help-text {
            @apply hidden text-xs text-(--c1);
        }

        &.error {
            select,
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

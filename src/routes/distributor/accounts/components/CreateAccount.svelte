<script lang="ts">
    import _ from 'lodash'
    import accountTypes from '$lib/config/account.types'
    import create from '../create.context.svelte'
</script>

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
            <button class="submit-btn btn" onclick={() => create.validate()}> Submit </button>
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

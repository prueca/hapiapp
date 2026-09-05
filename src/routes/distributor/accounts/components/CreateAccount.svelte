<script lang="ts">
    import _ from 'lodash'
    import accountTypes from '$lib/config/account.types'
</script>

<div class="modal-open modal">
    <div class="modal-box">
        <div class="heading">
            <p class="mb-4 text-xl font-medium">Create an account</p>
        </div>
        <div>
            <!-- account type -->
            <div class="fieldset">
                <label class="label">Select account type</label>
                <select class="select">
                    <option disabled selected>Choose one</option>
                    <option value={accountTypes.DEALER}>
                        {_.upperFirst(accountTypes.DEALER)}
                    </option>
                    <option value={accountTypes.HAPISTORE}>
                        {_.upperFirst(accountTypes.HAPISTORE)}
                    </option>
                </select>
            </div>

            <!-- name -->
            <fieldset class="fieldset">
                <label class="label">Enter account name</label>
                <input type="text" id="name" class="input w-full" placeholder="Account name" />
            </fieldset>

            <!-- address -->
            <fieldset class="fieldset">
                <label class="label">Enter account address</label>
                <input
                    type="text"
                    id="address"
                    class="input w-full"
                    placeholder="Complete address"
                />
            </fieldset>

            <!-- phone -->
            <fieldset class="fieldset">
                <label class="label">Enter phone number</label>
                <input type="text" id="phone" class="input w-full" placeholder="Contact number" />
            </fieldset>

            <!-- isr code -->
            <fieldset class="fieldset">
                <label class="label">Enter ISR Code</label>
                <input type="text" id="isr-code" class="input w-full" placeholder="ISR code" />
            </fieldset>

            <!-- sap code -->
            <fieldset class="fieldset">
                <label class="label">Enter SAP Code</label>
                <input type="text" id="sap-code" class="input w-full" placeholder="SAP code" />
            </fieldset>
        </div>
        <div class="modal-action">
            <button class="submit-btn btn"> Submit </button>
            <button class="close-btn btn"> Close </button>
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
    }

    .close-btn {
        @apply cursor-pointer rounded-lg border-none;
    }
    .submit-btn {
        @apply cursor-pointer rounded-lg border-none bg-(--c1) text-white;
    }
</style>

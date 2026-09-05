<script lang="ts">
    import _ from 'lodash'
    import Icon from '@iconify/svelte'
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
                <div class="grid grid-cols-2 gap-4">
                    <div class="w/1-2 grow">
                        <input id="dealer" class="hidden" type="radio" name="options" />
                        <label for="dealer" class="btn btn-lg">
                            <Icon
                                icon="material-symbols:deployed-code-account-outline-rounded"
                                width="24"
                            />
                            <div>{_.upperFirst(accountTypes.DEALER)}</div>
                        </label>
                    </div>
                    <div class="w/1-2 grow">
                        <input id="hapistore" class="hidden" type="radio" name="options" />
                        <label for="hapistore" class="btn btn-lg">
                            <Icon icon="ant-design:shop-outlined" width="24" />
                            <div>{_.upperFirst(accountTypes.HAPISTORE)}</div>
                        </label>
                    </div>
                </div>
            </div>

            <!-- name -->
            <fieldset class="fieldset">
                <label class="label">Name</label>
                <input type="text" id="name" class="input w-full" placeholder="Account name" />
            </fieldset>

            <!-- address -->
            <fieldset class="fieldset">
                <label class="label">Address</label>
                <input
                    type="text"
                    id="address"
                    class="input w-full"
                    placeholder="Complete address"
                />
            </fieldset>

            <!-- phone -->
            <fieldset class="fieldset">
                <label class="label">Phone</label>
                <input type="text" id="phone" class="input w-full" placeholder="Contact number" />
            </fieldset>

            <!-- isr code -->
            <fieldset class="fieldset">
                <label class="label">ISR Code</label>
                <input type="text" id="isr-code" class="input w-full" placeholder="ISR code" />
            </fieldset>

            <!-- sap code -->
            <fieldset class="fieldset">
                <label class="label">SAP Code</label>
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

        label.btn {
            @apply w-full rounded-lg;
        }

        input[type='radio']:checked + .btn {
            @apply border-none bg-(--c1) text-white;
        }
    }

    .close-btn {
        @apply cursor-pointer rounded-lg border-none;
    }
    .submit-btn {
        @apply cursor-pointer rounded-lg border-none bg-(--c1) text-white;
    }
</style>

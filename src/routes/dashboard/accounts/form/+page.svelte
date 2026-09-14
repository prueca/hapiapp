<script lang="ts">
    import Dock from '../../../components/Dock.svelte'
    import MerchantName from '../../../components/MerchantName.svelte'
    import TopBar from '../../../components/TopBar'
    import { goto } from '$app/navigation'
    import { page } from '$app/state'
    import accounts, { type Merchant } from '../accounts.state.svelte'

    const id = $derived(page.url.searchParams.get('id'))
    const isUpdate = $derived(id !== null)

    const emptyAccount: Merchant = {
        id: '',
        name: '',
        address: '',
        phone: '',
        isr_code: '',
        sap_code: '',
        company_code: '',
        account_type: 'distributor',
        associate_id: ''
    }

    const form = $state<Merchant>({ ...emptyAccount })

    $effect(() => {
        accounts.load()
    })

    let appliedId = $state('')

    $effect(() => {
        if (!id || id === appliedId) return
        const found = accounts.merchants.find((merchant) => merchant.id === id)
        form.id = id
        if (found) {
            Object.assign(form, found)
        } else {
            form.name = ''
            form.address = ''
            form.phone = ''
            form.isr_code = ''
            form.sap_code = ''
            form.company_code = ''
            form.account_type = 'distributor'
            form.associate_id = ''
        }
        appliedId = id
    })

    const fields = [
        { label: 'Merchant Name', key: 'name', type: 'text', placeholder: 'Enter merchant name' },
        {
            label: 'Company Code',
            key: 'company_code',
            type: 'text',
            placeholder: 'Enter company code'
        },
        { label: 'Phone No.', key: 'phone', type: 'tel', placeholder: 'Enter phone no.' },
        { label: 'Address', key: 'address', type: 'text', placeholder: 'Enter address' },
        { label: 'ISR Code', key: 'isr_code', type: 'text', placeholder: 'Enter ISR code' },
        { label: 'SAP Code', key: 'sap_code', type: 'text', placeholder: 'Enter SAP code' },
        {
            label: 'Associate ID',
            key: 'associate_id',
            type: 'text',
            placeholder: 'Enter associate id'
        }
    ] as const

    function submit(event: SubmitEvent) {
        event.preventDefault()
        goto('/dashboard/accounts')
    }

    function cancel() {
        goto('/dashboard/accounts')
    }
</script>

<div class="content-wrapper">
    <TopBar />
    <MerchantName />

    <h1 class="mb-6">{isUpdate ? 'Update Account' : 'New Account'}</h1>

    <form onsubmit={submit}>
        <div class="sub-container">
            {#each fields as field}
                <div class="field">
                    <label for={field.key} class="field-label">{field.label}</label>
                    <input
                        id={field.key}
                        type={field.type}
                        class="input"
                        placeholder={field.placeholder}
                        bind:value={form[field.key]}
                    />
                </div>
            {/each}

            <div class="field">
                <label for="account_type" class="field-label">Account Type</label>
                <select class="input" bind:value={form.account_type}>
                    <option value="distributor">Distributor</option>
                    <option value="dealer">Dealer</option>
                    <option value="hapistore">Hapistore</option>
                </select>
            </div>
        </div>

        <div class="sub-container">
            <button type="submit" class="button"><span>Save</span></button>
            <button type="button" class="button button-ghost" onclick={cancel}>
                <span>Cancel</span>
            </button>
        </div>
    </form>
</div>

<Dock />

<style lang="postcss">
    @reference 'tailwindcss';

    h1 {
        @apply mt-0! mb-6;
    }

    .field {
        @apply mb-4;

        .input {
            @apply block w-full;
        }
    }

    .field-label {
        @apply mb-1 text-sm font-medium text-(--font-color);
    }

    .sub-container {
        @apply mx-auto w-[80%] space-y-2;
    }

    .sub-container:has(button) {
        @apply w-30;
    }

    .button {
        @apply m-auto mt-2 w-full rounded-lg border-none bg-(--c1) py-2 text-center text-lg text-white shadow-(--c1-shadow);
    }

    .button-ghost {
        @apply bg-transparent text-(--c1) shadow-none;
    }
</style>

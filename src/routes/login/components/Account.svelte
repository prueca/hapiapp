<script lang="ts">
    import Icon from '@iconify/svelte'
    import loginState from '../login.state.svelte'
    import _ from 'lodash'

    type Account = {
        id: string
        type: string
        name: string
        address: string
        companyCode: string
    }

    type Props = {
        account: Account
    }

    let { account }: Props = $props()
</script>

<button class="account" type="button" onclick={() => loginState.authorize(account.companyCode)}>
    <div class="w-full">
        <div class="account-name">{account.name}</div>
        <div class="account-details">
            <span>{_.upperFirst(account.type)}</span>
            <span class="text-base-content/20">•</span>
            <class class="w-2/3 truncate">{account.address}</class>
        </div>
    </div>
    <Icon icon="basil:caret-right-outline" class="text-gray-300" width="32" />
</button>

<style lang="postcss">
    @reference 'tailwindcss';

    .account {
        @apply flex w-full cursor-pointer items-center rounded-xl border border-gray-300 px-4 py-3.5 text-left transition-all duration-150 outline-none active:scale-[0.99];
    }

    .account-name {
        @apply truncate font-semibold;
    }

    .account-details {
        @apply mt-1 flex flex-wrap items-center gap-x-2 text-xs text-gray-400;
    }
</style>

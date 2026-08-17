<script lang="ts">
    import Account from './Account.svelte'
    import loginState from '../login.state.svelte'
</script>

<div class="account-selection">
    <div class="modal" class:modal-open={loginState.openAccountSelection}>
        <div class="modal-box">
            <div class="heading">
                <p class="mb-1 text-xl font-bold">Login As...</p>
                <p class="text-sm text-gray-400">Pick an account to login</p>
            </div>
            <div class="account-list">
                {#each loginState.accounts as account}
                    <Account {account} />
                {/each}
            </div>
            <div class="modal-action">
                <button class="cancel-btn btn" onclick={() => loginState.toggleAccountSelection()}>
                    Cancel
                </button>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .account-list {
        @apply mt-6 flex flex-col gap-2;
    }

    .cancel-btn {
        @apply rounded-lg border-none bg-(--c1) text-white;
    }
</style>

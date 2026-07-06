<script lang="ts">
    import Icon from '@iconify/svelte'
    import Cabcon from './Cabcon.svelte'
    import Account from './Account.svelte'
</script>

<div class="content-wrapper bg-gray-100">
    <div class="store-name">
        <Icon icon="material-symbols:store-outline-rounded" width="22" />
        <div>Lorem Ipsum Store</div>
    </div>
    <div class="tabs-lift tabs">
        <!-- home -->
        <label class="tab">
            <input type="radio" name="tabs" checked />
            <!-- <Icon icon="solar:home-2-outline" width="22" /> -->
            <span class="px-2 md:px-4">Home</span>
        </label>
        <div class="tab-content border-base-300 bg-base-100 p-6">
            <Cabcon />
        </div>

        <!-- account -->
        <label class="tab">
            <input type="radio" name="tabs" />
            <!-- <Icon icon="solar:user-linear" width="22" /> -->
            <span class="px-2 md:px-4">Account</span>
        </label>
        <div class="tab-content border-base-300 bg-base-100 p-6">
            <Account />
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .store-name {
        @apply mb-4 flex items-center gap-2;
    }
</style>

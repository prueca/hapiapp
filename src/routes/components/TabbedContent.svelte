<script lang="ts">
    import Icon from '@iconify/svelte'
    import Cabcon from './Cabcon.svelte'
</script>

<div class="bg-gray-100">
    <div class="content-wrapper">
        <div class="store-name">
            <Icon icon="material-symbols:store-outline-rounded" width="22" />
            <div>Lorem Ipsum Store</div>
        </div>
        <div class="tabs-lift tabs">
            <!-- home -->
            <label class="tab">
                <input type="radio" name="tabs" checked />
                <!-- <Icon icon="solar:home-2-outline" width="22" /> -->
                <span class="ml-1">Home</span>
            </label>
            <div class="tab-content border-base-300 bg-base-100 p-6">
                <Cabcon />
            </div>

            <!-- account -->
            <label class="tab">
                <input type="radio" name="tabs" />
                <!-- <Icon icon="solar:user-linear" width="22" /> -->
                <span class="ml-1">Account</span>
            </label>
            <div class="tab-content border-base-300 bg-base-100 p-6">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quae, quos.
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .store-name {
        @apply mb-4 flex items-center gap-2;
    }
</style>

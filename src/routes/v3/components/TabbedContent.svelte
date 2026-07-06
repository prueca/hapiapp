<script lang="ts">
    import FreezerList from './FreezerList'
</script>

<div class="content-wrapper">
    <div class="tabs tabs-border flex w-full">
        <!-- home -->
        <label class="tab flex-1">
            <input type="radio" name="tabs" checked />
            <span class="px-1 md:px-4">Home</span>
        </label>
        <div class="tab-content p-2 md:px-0">
            <FreezerList />
        </div>

        <!-- account -->
        <label class="tab flex-1">
            <input type="radio" name="tabs" />
            <span class="px-1 md:px-4">Account</span>
        </label>
        <div class="tab-content p-2 md:px-0">
            Lorem Ipsum
        </div>
        
        <!-- cabcon -->
        <label class="tab flex-1">
            <input type="radio" name="tabs" />
            <span class="px-2 md:px-4">Cabcon</span>
        </label>
        <div class="tab-content p-2 md:px-0">
            Lorem Ipsum
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .content-wrapper {
        @apply px-0 -mt-16;
    }
</style>

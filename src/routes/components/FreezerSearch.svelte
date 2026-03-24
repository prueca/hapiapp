<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="search-bar">
    <div class="flex gap-2">
        <!-- search input -->
        <label class="input input-lg">
            <Icon icon="lets-icons:search-light" width="24" class="opacity-50" />
            <input type="search in" required placeholder="Search freezer..." />
        </label>
        <!-- search button -->
        <button class="search-btn btn btn-lg">Search</button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .search-bar {
        @apply mb-8 flex w-full;
    }

    .input {
        @apply text-base;
    }

    .search-btn {
        @apply text-base;
    }
</style>

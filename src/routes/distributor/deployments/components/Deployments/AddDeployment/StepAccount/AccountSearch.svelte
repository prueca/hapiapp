<script lang="ts">
    import Icon from '@iconify/svelte'
    import step2 from '../../../../step2.svelte'

    const searchAccount = (event: KeyboardEvent) => {
        if (event.key === 'Enter') {
            step2.searchAccount()
        }
    }
</script>

<div>
    <p class="label">Search account</p>
    <div class="flex items-center justify-between gap-2">
        <!-- input -->
        <input
            class="input grow"
            type="search"
            placeholder="Enter account ID or name"
            bind:value={step2.query}
            onkeydown={searchAccount}
        />
        <!-- search button -->
        <button class="btn join-item" type="button" onclick={() => step2.searchAccount()}>
            <Icon icon="icon-park-outline:search" width="18" />
        </button>
    </div>
    <p class="label mt-2 text-xs" class:hidden={!step2.message}>{step2.message}</p>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .label {
        @apply mb-2 text-sm;
    }

    .input {
        @apply rounded-l;
    }

    .btn {
        @apply rounded-r;
    }
</style>

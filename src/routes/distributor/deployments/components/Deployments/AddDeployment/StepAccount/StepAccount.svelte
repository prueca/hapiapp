<script lang="ts">
    import AccountSearch from './AccountSearch.svelte'
    import AccountSearchResult from './AccountSearchResult.svelte'
    import AccountSelected from './AccountSelected.svelte'
    import deployment from '../../../../deployment.svelte'

    const next = () => {
        deployment.setCurrentStep(3)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const back = () => {
        deployment.setCurrentStep(1)
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
</script>

<div class="flex flex-col gap-4 bg-(--c6) p-4 md:gap-4">
    <!-- search account -->
    <div class="section bg-base-100">
        <AccountSearch />
        <div class="overflow-hidden rounded">
            <AccountSearchResult selected />
            <AccountSearchResult />
            <AccountSearchResult />
        </div>
    </div>

    <!-- destination account -->
    <div class="section bg-base-100">
        <div class="mb-4">
            <div class="mb-1 text-lg">Destination Account</div>
            <div class="text-xs text-gray-400">Selected account</div>
        </div>
        <AccountSelected />
        <div class="flex flex-row-reverse gap-2 text-right">
            <button type="button" class="btn btn-ghost btn-sm" onclick={next}>Next</button>
            <button type="button" class="btn btn-ghost btn-sm" onclick={back}>Back</button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .section {
        @apply rounded p-4 shadow;
    }

    .btn {
        @apply no-underline;
    }
</style>

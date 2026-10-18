<script lang="ts">
    import Skeleton from '../../../../../../components/Skeleton.svelte'
    import AccountSearch from './AccountSearch.svelte'
    import AccountSearchResult from './AccountSearchResult.svelte'
    import AccountSelected from './AccountSelected.svelte'
    import step2 from '../../../../step2.svelte'
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
        {#if step2.loading}
            <Skeleton class="h-34 w-full" />
        {:else if step2.accounts?.length}
            <div class="mt-4 overflow-hidden rounded">
                {#each step2.accounts as account (account.id)}
                    <AccountSearchResult {account} />
                {/each}
            </div>
        {/if}
    </div>

    <!-- destination account -->
    <div class="section bg-base-100">
        <p class="label">Destination account</p>
        {#if !deployment.destinationAccount}
            <div class="text-gray-400 italic">Search and select destination account</div>
        {:else}
            <AccountSelected />
        {/if}
        <div class="flex flex-row-reverse gap-2 text-right">
            {#if deployment.destinationAccount}
                <button type="button" class="btn btn-ghost btn-sm" onclick={next}>Next</button>
            {/if}
            <button type="button" class="btn btn-ghost btn-sm" onclick={back}>Back</button>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .section {
        @apply rounded p-4 shadow;
    }

    .label {
        @apply mb-2 text-sm;
    }

    .btn {
        @apply no-underline;
    }
</style>

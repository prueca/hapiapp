<!--svelte-ignore a11y_missing_attribute -->
<script lang="ts">
    import Stepper from './Stepper.svelte'
    import StepFreezers from './StepFreezers.svelte'
    import StepAccount from './StepAccount.svelte'

    let step = $state(2)
</script>

<div>
    <Stepper />
    <div class="content">
        {#if step === 1}
            <StepFreezers />
        {:else if step === 2}
            <StepAccount />
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .content {
        @apply overflow-hidden rounded-b-lg bg-gray-50 p-2 md:p-4;
    }
</style>

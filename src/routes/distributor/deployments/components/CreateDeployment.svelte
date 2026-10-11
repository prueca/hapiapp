<!--svelte-ignore a11y_missing_attribute -->
<script lang="ts">
    import Stepper from './Stepper.svelte'
    import StepFreezers from './StepFreezers.svelte'
    import StepAccount from './StepAccount.svelte'
    import StepDate from './StepDate.svelte'

    let step = $state(3)
</script>

<div>
    <Stepper />
    <div class="content">
        {#if step === 3}
            <StepDate />
        {:else if step === 2}
            <StepAccount />
        {:else}
            <StepFreezers />
        {/if}
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .content {
        @apply overflow-hidden rounded-b-lg bg-gray-50 p-2 md:p-4;
    }
</style>

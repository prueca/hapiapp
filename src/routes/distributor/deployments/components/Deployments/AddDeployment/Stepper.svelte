<!--svelte-ignore a11y_invalid_attribute -->
<script lang="ts">
    import Icon from '@iconify/svelte'
    import deployment from '../../../deployment.svelte'

    const navigate = (step: number) => {
        switch (step) {
            case 3:
                if (deployment.freezers.length && deployment.destinationAccount) {
                    deployment.setCurrentStep(3)
                }
                break

            case 2:
                if (deployment.freezers.length) {
                    deployment.setCurrentStep(2)
                }
                break

            default:
                deployment.setCurrentStep(1)
        }
    }
</script>

<div class="stepper">
    <!-- Step 1: Select Freezer -->
    <button type="button" class="step active btn btn-link" onclick={() => navigate(1)}>
        <div class="step-icon">
            <Icon icon="reicon:fridge-filled" width="24" />
        </div>
        <span class="step-label">Freezers</span>
    </button>

    <!-- Connector Line -->
    <div class="connector">
        {#if deployment.currentStep >= 2}
            <div class="active"></div>
        {/if}
    </div>

    <!-- Step 2: Select Account -->
    <button
        type="button"
        class="step btn btn-link"
        class:active={deployment.currentStep >= 2}
        onclick={() => navigate(2)}
    >
        <div class="step-icon">
            <Icon icon="bi:passport-fill" width="24" />
        </div>
        <span class="step-label">Account</span>
    </button>

    <!-- Connector Line -->
    <div class="connector">
        {#if deployment.currentStep === 3}
            <div class="active"></div>
        {/if}
    </div>

    <!-- Step 3: Select Date -->
    <button
        type="button"
        class="step btn btn-link"
        class:active={deployment.currentStep === 3}
        onclick={() => navigate(3)}
    >
        <div class="step-icon">
            <Icon icon="clarity:calendar-solid-badged" width="24" />
        </div>
        <span class="step-label">Date</span>
    </button>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .stepper {
        --active-color: var(--c1);

        @apply mx-auto mt-1 flex w-full items-center justify-between px-2 py-4 md:px-4;
    }

    .step {
        @apply flex h-auto flex-1 flex-col items-center text-gray-300 no-underline;

        &.active {
            @apply text-(--active-color);
        }

        .step-label {
            @apply text-sm font-medium;
        }
    }

    .connector {
        @apply mx-2 hidden h-px flex-1 bg-gray-300 md:block;

        .active {
            @apply h-full bg-(--active-color);
        }
    }
</style>

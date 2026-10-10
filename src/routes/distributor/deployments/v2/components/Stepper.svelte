<!--svelte-ignore a11y_missing_attribute -->
<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<div class="stepper">
    <!-- Step 1: Select Freezer -->
    <div class="step active">
        <div class="step-icon">
            <Icon icon="reicon:fridge-filled" width="24" />
        </div>
        <span class="step-label">Freezers</span>
    </div>

    <!-- Connector Line -->
    <div class="connector">
        <div class="active"></div>
    </div>

    <!-- Step 2: Select Account -->
    <div class="step active">
        <div class="step-icon">
            <Icon icon="bi:passport-fill" width="24" />
        </div>
        <span class="step-label">Account</span>
    </div>

    <!-- Connector Line -->
    <div class="connector">
        <div class="active"></div>
    </div>

    <!-- Step 3: Select Date -->
    <div class="step active">
        <div class="step-icon">
            <Icon icon="clarity:calendar-solid-badged" width="24" />
        </div>
        <span class="step-label">Date</span>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .stepper {
        --step-color: var(--c2);

        @apply mx-auto mt-1 flex items-center justify-between px-2 py-4 md:px-4;
    }

    .step {
        @apply flex h-auto flex-1 cursor-pointer flex-col items-center text-gray-500;

        &.active {
            @apply text-(--step-color);
        }

        &:hover,
        &:active {
            .step-icon {
                @apply text-(--c1);
            }

            .step-label {
                @apply text-(--c1);
            }
        }

        .step-icon {
            @apply mb-2;
        }

        .step-label {
            @apply text-sm font-medium;
        }
    }

    .connector {
        @apply mx-2 hidden h-0.5 flex-1 bg-gray-300 md:block;

        .active {
            @apply h-full bg-(--step-color);
        }
    }
</style>

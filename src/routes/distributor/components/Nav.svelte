<!--svelte-ignore  a11y_invalid_attribute -->
<script lang="ts">
    import logo from '$lib/assets/Selecta_Logo_2003.svg'
    import { PUBLIC_APP_NAME } from '$env/static/public'
    import Icon from '@iconify/svelte'
</script>

<div class="navigation">
    <!-- Brand -->
    <a href="/">
        <div class="brand-container">
            <div class="w-6">
                <img src={logo} alt="Selecta Logo" />
            </div>
            <div class="app-name">{PUBLIC_APP_NAME}</div>
        </div>
    </a>
    <!-- Nav -->
    <div class="flex items-center gap-6">
        <div class="flex items-center gap-6">
            <a href="#" class="btn-link">
                <Icon icon="lsicon:home-outline" width="24" />
            </a>
        </div>
        <div class="right-end">
            <a href="#" class=" h-full btn-link">
                <Icon icon="boxicons:menu" width="24" />
            </a>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .navigation {
        @apply mb-4 flex items-center justify-between overflow-hidden bg-(--c7) p-0 pl-4;
    }

    .brand-container {
        @apply flex items-center gap-2;

        .app-name {
            @apply text-xl;
        }
    }

    .right-end {
        @apply h-full bg-(--c1) p-4 text-(--c7);
    }

    .btn-link {
        @apply no-underline;
    }
</style>

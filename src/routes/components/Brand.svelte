<script lang="ts">
    import logo from '$lib/assets/Selecta_Logo_2003.svg'
    import { PUBLIC_APP_NAME } from '$env/static/public'
</script>

<a href="/">
    <div class="brand-container">
        <div class="w-6">
            <img src={logo} alt="Selecta Logo" />
        </div>
        <div class="app-name">{PUBLIC_APP_NAME}</div>
    </div>
</a>

<style lang="postcss">
    @reference 'tailwindcss';

    .brand-container {
        @apply ml-2 flex items-center gap-2;

        .app-name {
            @apply text-xl;
        }
    }
</style>

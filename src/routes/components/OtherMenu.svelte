<script lang="ts">
</script>

<div class="menu-wrapper">
    <div class="menu-container">
        <div class="section">
            <a href="/" class="menu-link">Account</a>
            <a href="/" class="menu-link">Dashboard</a>
        </div>

        <div class="section">
            <span class="section-label">Support</span>
            <a href="/" class="menu-link">Chat with us</a>
            <a href="/" class="menu-link">Contact us</a>
        </div>

        <div class="section">
            <span class="section-label">Legal</span>
            <a href="/" class="menu-link">Terms of use</a>
            <a href="/" class="menu-link">Data protection policy</a>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .menu-wrapper {
        @apply fixed right-2 bottom-18 z-50;
    }

    .menu-container {
        @apply flex flex-col rounded-2xl border border-gray-200 bg-white shadow-xl;
        width: 280px;
        padding: 6px;
    }

    .section {
        @apply flex flex-col;
    }

    .section + .section {
        @apply mt-2 border-t border-gray-300 pt-2;
    }

    .section-label {
        @apply px-3 py-1.5 text-[10px] font-semibold tracking-wider text-gray-400 uppercase;
    }

    .menu-link {
        @apply block w-full rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-100 hover:text-gray-900;
    }
</style>

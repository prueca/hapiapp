<script lang="ts">
    import Icon from '@iconify/svelte'
</script>

<!-- mobile -->

<div class="dropdown dropdown-end lg:hidden">
    <button tabIndex={0} class="btn btn-square btn-ghost btn-xl">
        <Icon icon="gg:menu-right" width="32" />
    </button>
    <ul tabIndex="-1" class="dropdown-content menu menu-sm rounded-box bg-base-100">
        <div class="greetings">Hello there, John Doe!</div>
        <div class="menu-item-group">
            <li>
                <a href="/profile" class="menu-item">User Profile</a>
            </li>
        </div>
        <div class="menu-item-group">
            <div class="group-title">Support</div>
            <li>
                <a href="faq" class="menu-item">FAQ</a>
            </li>
            <li>
                <a href="/chat-with-us" class="menu-item">Chat With Us</a>
            </li>
            <li>
                <a href="/contact-us" class="menu-item">Contact Us</a>
            </li>
        </div>
        <div class="menu-item-group">
            <div class="group-title">Legal</div>
            <li>
                <a href="/terms-and-use" class="menu-item">Terms and Use</a>
            </li>
            <li>
                <a href="/data-protection-policy" class="menu-item">Data Protection Policy</a>
            </li>
        </div>
        <div class="menu-item-group">
            <li>
                <a href="/logout" class="menu-item">Logout</a>
            </li>
        </div>
    </ul>
</div>

<!-- desktop -->

<div class="hidden lg:block">
    <ul class="menu menu-horizontal items-center px-1">
        <li>
            <a class="menu-item btn btn-ghost btn-lg" href="/faq">FAQ</a>
        </li>
        <li>
            <a class="menu-item btn btn-ghost btn-lg" href="/contact-us">Contact Us</a>
        </li>
        <li>
            <a class="menu-item btn btn-ghost btn-lg" href="/terms-and-use">Terms and Use</a>
        </li>

        <div class="divider divider-horizontal"></div>

        <a class="menu-item btn btn-square btn-ghost btn-lg" href="/profile">
            <Icon class="icon" icon="mi:user" width="24" />
        </a>
        <a class="menu-item btn btn-square btn-ghost btn-lg" href="/logout">
            <Icon class="icon" icon="solar:logout-outline" width="24" />
        </a>
    </ul>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    /* mobile */

    .dropdown-content {
        @apply z-1 mt-3 w-70 border border-gray-200 p-2 shadow-lg;

        .greetings {
            @apply w-full truncate p-2 text-base text-gray-400;
        }

        .menu-item-group {
            @apply mb-2 border-b border-b-gray-200 pb-2;

            &:last-child {
                @apply mb-0 border-none pb-0;
            }

            .group-title {
                @apply mb-2 px-2 font-bold text-gray-400;
            }

            .menu-item {
                @apply text-base;
            }
        }
    }

    /* desktop */

    .menu .menu-item {
        @apply text-base;
    }
</style>

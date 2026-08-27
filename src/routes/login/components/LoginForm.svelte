<script lang="ts">
    import logo from '$lib/assets/Selecta_Logo_2003.svg'
    import Icon from '@iconify/svelte'
    import auth from '../auth.context.svelte'
</script>

<div class="login-form">
    <!-- logo -->
    <div class="logo-container">
        <img src={logo} alt="Selecta Logo" />
    </div>

    <!-- message -->
    <div class="message alert hidden alert-soft alert-error" class:hidden={auth.error === null}>
        <Icon class="icon" icon="material-symbols:warning-outline-rounded" width="20" />
        <span>{auth.error}</span>
    </div>

    <div class="fields-container">
        <!-- username -->
        <div class="field">
            <div class="field-label">Username</div>
            <label class="input">
                <Icon class="icon" icon="mi:user" width="20" />
                <input bind:value={auth.username} type="email" placeholder="Enter username" />
            </label>
        </div>

        <!-- password -->
        <div class="field">
            <div class="field-label">Password</div>
            <label class="input">
                <Icon class="icon" icon="material-symbols:key-outline-rounded" width="20" />
                <input
                    bind:value={auth.password}
                    type={auth.showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                />
                <button class="cursor-pointer" onclick={() => auth.togglePasswordMask()}>
                    <Icon class="icon" icon="bx:show" width="20" />
                </button>
            </label>
        </div>
    </div>

    <div class="bottom-section">
        <div class="options">
            <!-- forgot password -->
            <a href="/password/reset" class="forgot-password">Forgot password?</a>
        </div>

        <!-- login button -->
        <button class="login-btn btn" onclick={() => auth.login()}>
            {#if auth.status === 1}
                <span class="loading loading-spinner"></span>
                <span>Please wait...</span>
            {:else if auth.status === 2}
                <span class="loading loading-spinner"></span>
                <span>Logging in...</span>
            {:else}
                <span>Login</span>
            {/if}
        </button>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .login-form {
        @apply w-full max-w-105 px-4;

        .message {
            @apply mb-4;
        }
    }

    .logo-container {
        @apply mx-auto mb-8 w-40;

        img {
            @apply h-full w-full object-contain;
        }
    }

    .fields-container {
        @apply mb-4 space-y-4;

        .field .field-label {
            @apply mb-1 text-sm;
        }

        .field .input {
            @apply w-full rounded-lg;
        }
    }

    .bottom-section {
        .options {
            @apply my-4 flex items-center justify-between;

            .forgot-password {
                @apply text-sm text-(--font-color);
            }
        }

        .login-btn {
            @apply w-full rounded-lg border-none bg-(--c1) text-white;
        }
    }
</style>

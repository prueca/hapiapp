<script lang="ts">
    import './style.css'
    import logo from '$lib/assets/Selecta_Logo_2003.svg'
    import Icon from '@iconify/svelte'

    let showPassword = $state(false)

    const revealPassword = () => {
        showPassword = !showPassword
    }
</script>

<div class="center">
    <div class="form-container">
        <!-- logo -->
        <div class="logo-container">
            <img src={logo} alt="Selecta Logo" />
        </div>

        <!-- message -->
        <div class="message alert hidden alert-soft alert-error">
            <Icon class="icon" icon="material-symbols:warning-outline-rounded" width="20" />
            <span>Invalid username or password.</span>
        </div>

        <div class="fields-container">
            <!-- username -->
            <div class="field">
                <div class="field-label">Username</div>
                <label class="input input-xl">
                    <Icon class="icon" icon="mi:user" width="20" />
                    <input type="email" placeholder="Enter username" />
                </label>
            </div>

            <!-- company code -->
            <div class="field">
                <div class="field-label">Company code</div>
                <label class="input input-xl">
                    <Icon class="icon" icon="streamline:business-card" width="20" />
                    <input type="text" placeholder="Enter company code" />
                </label>
            </div>

            <!-- password -->
            <div class="field">
                <div class="field-label">Password</div>
                <label class="input input-xl">
                    <Icon class="icon" icon="material-symbols:key-outline-rounded" width="20" />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Enter password" />
                    <button class="cursor-pointer" onclick={revealPassword}>
                        <Icon class="icon" icon="bx:show" width="20" />
                    </button>
                </label>
            </div>
        </div>

        <div class="bottom-section">
            <div class="options">
                <!-- remember me -->
                <label class="remember-me">
                    <input type="checkbox" class="checkbox -mt-1 checkbox-xs" />
                    <span>Remember me</span>
                </label>

                <!-- forgot password -->
                <a href="/password/reset" class="forgot-password">Forgot password?</a>
            </div>

            <!-- login button -->
            <button class="login-btn btn btn-xl"> Login </button>
        </div>
    </div>
</div>

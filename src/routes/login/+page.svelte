<script lang="ts">
    import LoginForm from './components/LoginForm.svelte'
    import AccountSelection from './components/AccountSelection.svelte'
</script>

<div class="center">
    <LoginForm />
    <AccountSelection />
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .center {
        @apply flex h-screen items-center justify-center;
    }
</style>

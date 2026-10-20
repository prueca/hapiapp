<script lang="ts">
    import Nav from '../components/Nav.svelte'
    import AccountList from './components/AccountList.svelte'
    import CreateAccount from './components/CreateAccount.svelte'
    import DeleteAccount from './components/DeleteAccount.svelte'
    import UpdateAccount from './components/UpdateAccount.svelte'
</script>

<div class="content-wrapper">
    <Nav />
    <AccountList />
    <CreateAccount />
    <DeleteAccount />
    <UpdateAccount />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>

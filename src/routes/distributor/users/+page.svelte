<script lang="ts">
    import Nav from '../components/Nav.svelte'
    import UserList from './components/UserList.svelte'
    import CreateUser from './components/CreateUser.svelte'
    import UpdateUser from './components/UpdateUser.svelte'
    import DeleteUser from './components/DeleteUser.svelte'
</script>

<div class="content-wrapper">
    <Nav />
    <UserList />
    <CreateUser />
    <UpdateUser />
    <DeleteUser />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>

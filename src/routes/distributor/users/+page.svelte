<script lang="ts">
    import Dock from '../../components/Dock.svelte'
    import TopBar from '../../components/TopBar'
    import AccountName from '../../components/AccountName.svelte'
    import Chart from '../../components/Chart.svelte'
    import UserList from './components/UserList.svelte'
    import CreateUser from './components/CreateUser.svelte'
    import UpdateUser from './components/UpdateUser.svelte'
    import DeleteUser from './components/DeleteUser.svelte'
</script>

<div class="content-wrapper">
    <div class="pb-21">
        <TopBar />
        <AccountName />
        <Chart />
        <UserList />
        <CreateUser />
        <UpdateUser />
        <DeleteUser />
    </div>
    <Dock />
</div>

<style lang="postcss">
    @reference 'tailwindcss';
</style>

<!-- svelte-ignore a11y_label_has_associated_control -->
<script lang="ts">
    import userRoles, { getDisplayText } from '$lib/config/user.roles'
    import users from '../users.context.svelte'
</script>

<div class="user-selection">
    <div class="modal" class:modal-open={users.openSearchOptions}>
        <div class="modal-box">
            <div class="heading">
                <p class="mb-4 text-lg font-bold">Search and filter users...</p>
            </div>
            <div>
                <!-- search field -->
                <fieldset class="fieldset">
                    <label class="label">Search User</label>
                    <input
                        type="text"
                        id="name"
                        class="input w-full"
                        placeholder="Full name"
                        bind:value={users.query}
                        onkeyup={() => users.filter()}
                    />
                </fieldset>

                <!-- user role -->
                <fieldset class="fieldset">
                    <label class="label">User Role</label>
                    <select
                        class="select w-full"
                        bind:value={users.userRole}
                        onchange={() => users.filter()}
                    >
                        <option value="" disabled={true} selected>Pick user role</option>
                        <option value="">All</option>
                        <option value={userRoles.DISTRIBUTOR_ADMIN}>
                            {getDisplayText(userRoles.DISTRIBUTOR_ADMIN)}
                        </option>
                        <option value={userRoles.DISTRIBUTOR_USER}>
                            {getDisplayText(userRoles.DISTRIBUTOR_USER)}
                        </option>
                        <option value={userRoles.DEALER_ADMIN}>
                            {getDisplayText(userRoles.DEALER_ADMIN)}
                        </option>
                        <option value={userRoles.DEALER_USER}>
                            {getDisplayText(userRoles.DEALER_USER)}
                        </option>
                        <option value={userRoles.HAPISTORE_ADMIN}>
                            {getDisplayText(userRoles.HAPISTORE_ADMIN)}
                        </option>
                        <option value={userRoles.HAPISTORE_USER}>
                            {getDisplayText(userRoles.HAPISTORE_USER)}
                        </option>
                        <option value={userRoles.DIRECT_STORE_ADMIN}>
                            {getDisplayText(userRoles.DIRECT_STORE_ADMIN)}
                        </option>
                        <option value={userRoles.DIRECT_STORE_USER}>
                            {getDisplayText(userRoles.DIRECT_STORE_USER)}
                        </option>
                    </select>
                </fieldset>

                <!-- sort key -->
                <fieldset class="fieldset">
                    <label class="label">Sort By</label>
                    <select
                        class="select w-full"
                        bind:value={users.sortBy}
                        onchange={() => users.filter()}
                    >
                        <option value="createdAt" selected>Date Created</option>
                        <option value="firstName">First Name</option>
                        <option value="middleName">Middle Name</option>
                        <option value="lastName">Last Name</option>
                        <option value="role">Role</option>
                    </select>
                </fieldset>

                <!-- sort order -->
                <fieldset class="fieldset">
                    <label class="label">Sort Order</label>
                    <select
                        class="select w-full"
                        bind:value={users.sortOrder}
                        onchange={() => users.filter()}
                    >
                        <option value="asc">Ascending</option>
                        <option value="desc">Descending</option>
                    </select>
                </fieldset>
            </div>
            <div class="modal-action">
                <button class="close-btn btn" onclick={() => users.toggleSearchOptions(false)}>
                    Close
                </button>
            </div>
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    .fieldset {
        @apply not-last:mb-4;

        input,
        select {
            @apply rounded-lg;
        }
    }
    .close-btn {
        @apply cursor-pointer rounded-lg border-none;
    }
</style>

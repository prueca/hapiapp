<script lang="ts">
    import { page } from '$app/stores';

    interface Member {
        name: string;
        role: string;
        phone: string;
        status: 'active' | 'inactive';
    }

    // Mock data for "Updating" members (usually this comes from a +page.ts load function)
    const mockMembers: Record<string, Member> = {
        'juan-dela-cruz': { name: 'Juan Dela Cruz', role: 'Hapistore-Admin', phone: '(555) 012-3456', status: 'active' },
        'marco-rivera': { name: 'Marco Rivera', role: 'Hapistore-Admin', phone: '(555) 987-6543', status: 'active' },
        'priya-patel': { name: 'Priya Patel', role: 'Hapistore-User', phone: '(555) 234-5678', status: 'inactive' }
    };

    // Determine if we are in "Add" mode or "Edit" mode
    $: memberId = $page.params.id;
    $: isEditing = memberId !== 'new';

    let member: Member;

    // Initialize the form data based on the ID
    $: {
        if (isEditing && mockMembers[memberId]) {
            member = { ...mockMembers[memberId] };
        } else {
            member = {
                name: '',
                role: 'Hapistore-User',
                phone: '',
                status: 'active'
            };
        }
    }

    function handleSubmit() {
        if (isEditing) {
            console.log('Updating member:', memberId, member);
        } else {
            console.log('Creating new member:', member);
        }
        alert(isEditing ? 'Member updated!' : 'Member added!');
    }
</script>

<div class="content-wrapper">
    <h1>{isEditing ? 'Update Member' : 'Add New Member'}</h1>

    <form on:submit|preventDefault={handleSubmit}>
        <div class="sub-container">
            <!-- Full Name -->
            <div class="field">
                <label for="name" class="field-label">Full Name</label>
                <input
                    id="name"
                    type="text"
                    bind:value={member.name}
                    class="input"
                    placeholder="Enter name"
                    required
                />
            </div>

            <!-- Role -->
            <div class="field">
                <label for="role" class="field-label">Role</label>
                <select
                    id="role"
                    bind:value={member.role}
                    class="input"
                >
                    <option value="Hapistore-Admin">Hapistore-Admin</option>
                    <option value="Hapistore-User">Hapistore-User</option>
                </select>
            </div>

            <!-- Phone Number -->
            <div class="field">
                <label for="phone" class="field-label">Phone Number</label>
                <input
                    id="phone"
                    type="tel"
                    bind:value={member.phone}
                    class="input"
                    placeholder="Enter phone no."
                    required
                />
            </div>

            <!-- Status -->
            <div class="field">
                <label for="status" class="field-label">Status</label>
                <select
                    id="status"
                    bind:value={member.status}
                    class="input"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>
        </div>

        <div class="sub-container">
            <button type="submit" class="button">
                <span>{isEditing ? 'Update' : 'Save'} Member</span>
            </button>
        </div>
    </form>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    h1 {
        @apply mt-0! mb-6 text-lg font-semibold leading-9;
    }

    .field {
        @apply mb-4;

        .input {
            @apply block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-(--c1);
        }
    }

    .field-label {
        @apply mb-1 text-sm font-medium text-(--font-color);
    }

    .sub-container {
        @apply space-y-2 w-[80%] mx-auto;
    }

    .sub-container:has(button) {
        @apply w-30;
    }

    .button {
        @apply w-full m-auto mt-2 rounded-lg border-none bg-(--c1) py-2 text-lg text-center text-white shadow-(--c1-shadow);
    }
</style>

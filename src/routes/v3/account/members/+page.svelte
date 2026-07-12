<script lang="ts">
    interface Member {
        name: string
        role: string
        phone: string
        status: 'active' | 'inactive'
      }

      const members: Member[] = [
          { name: 'Juan Dela Cruz', role: 'Hapistore-Admin', phone: '(555) 012-3456', status: 'active' },
          { name: 'Marco Rivera', role: 'Hapistore-Admin', phone: '(555) 987-6543', status: 'active' },
          { name: 'Priya Patel', role: 'Hapistore-User', phone: '(555) 234-5678', status: 'inactive' }
      ]
</script>

<div class="content-wrapper">
    <div>
        <div class="section-title">
            <h1>Account Members</h1>
            <span class="">
                <a tabindex="0" role="button" href="/v3/account/members/new" class="btn btn-primary btn-sm theme-btn">
                        Add Member
                </a>
            </span>
            </div>
        <div class="space-y-3">
            {#each members as member}
                <div class="rounded-lg border border-gray-200 p-4">
                    <div class="flex items-center justify-between mb-2">
                        <span class="font-medium">{member.name}</span>
                        <a href="/v3/account/members/{member.name.toLowerCase().replace(' ', '-')}">
                            <span class="btn btn-sm btn-ghost">Update</span>
                        </a>
                    </div>
                    <div class="text-sm text-gray-500">{member.role}</div>
                    <div class="text-sm text-gray-500 mt-1">{member.phone}</div>
                    <div class="text-sm text-gray-500 mt-1">{member.status}</div>
                </div>
            {/each}
        </div>
    </div>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    h1 {
        @apply mb-0 text-lg font-semibold leading-9;
    }

     .section-title {
        @apply flex items-center justify-between mt-6 mb-6;
    }

    .theme-btn {
         @apply bg-(--c1) text-white border-none shadow-(--c1-shadow);
    }
</style>

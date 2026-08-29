<!--
  Loading placeholder for a freezer card.

  No props. A static gray stand-in that mirrors Item.svelte's layout (two badges,
  model/meta bars, three account bars) so the list region stays occupied during
  the initial load. Reuses the same class names as Item.svelte for visual parity.
  `animate-pulse` is gated behind `prefers-reduced-motion: no-preference`.
-->
<div class="freezer-item">
     <div class="top-row">
         <div class="badges">
             <span class="block"></span>
             <span class="block"></span>
         </div>
     </div>

     <div class="body">
         <span class="block w-2/3"></span>
         <span class="block meta"></span>
     </div>

     <div class="account-section">
         <span class="block w-1/3"></span>
         <span class="block w-1/2"></span>
         <span class="block w-1/4"></span>
     </div>
</div>

<style lang="postcss">
     @reference 'tailwindcss';

     .freezer-item {
         @apply rounded-lg border border-gray-100 bg-white p-4 shadow-sm;
     }

     .top-row {
         @apply flex justify-end;
     }

     .body {
         @apply mt-2 flex flex-col gap-2 border-b border-gray-100 pb-3;
     }

     .badges {
         @apply flex items-center gap-2;
     }

     .badges .block {
         @apply h-5 w-12 rounded-full bg-gray-100;
     }

     .block {
         @apply rounded bg-gray-100;
     }

     .body .block {
         @apply h-4;
     }

     .body .block.meta {
         @apply mt-1 h-3 w-1/2;
     }

     .account-section {
         @apply flex flex-col gap-0.5 pt-3;
     }

     .account-section .block {
         @apply h-3;
     }

     @media (prefers-reduced-motion: no-preference) {
         .block {
             @apply animate-pulse;
         }
     }
</style>

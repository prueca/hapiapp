<div class="deployment-item">
     <div class="main">
           <div class="designation">
                <span class="block w-1/3"></span>
                <span class="block w-1/2"></span>
           </div>
           <span class="qty block"></span>
      </div>
 </div>

<style lang="postcss">
     @reference 'tailwindcss';

     .deployment-item {
          @apply not-last:mb-4 not-last:border-b not-last:border-b-gray-100 not-last:pb-4;
      }

      .main {
          @apply flex items-start justify-between gap-4;
      }

     .designation {
          @apply min-w-0;
      }

      .qty {
          @apply h-9 w-20 flex-none rounded-full;
      }

      .block {
          @apply my-1 rounded bg-gray-100;
      }

      @media (prefers-reduced-motion: no-preference) {
           .block,
            .qty {
                @apply animate-pulse;
            }
       }
 </style>

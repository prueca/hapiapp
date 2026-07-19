<script lang="ts">
</script>

<div class="content-wrapper">
    <h1>Request for Account Details Update</h1>

    <form action="">
        <div class="sub-container">
            <!-- Merchant Name -->
            <div class="field">
                <label for="merchant-name" class="field-label">Merchant Name</label>
                <input id="merchant-name" type="text" class="input" placeholder="Enter merchant name">
            </div>

            <!-- Address -->
            <div class="field">
                <label for="address" class="field-label">Address</label>
                <input id="address" type="text" class="input" placeholder="Enter address">
            </div>

            <!-- Phone No. -->
            <div class="field">
                <label for="phone" class="field-label">Phone No.</label>
                <input id="phone" type="tel" class="input" placeholder="Enter phone no.">
            </div>

            <!-- Owner -->
            <div class="field">
                <label for="owner" class="field-label">Owner's name</label>
                <input id="owner" type="text" class="input" placeholder="Enter owner">
            </div>
        </div>

        <div class="sub-container">
            <button type="submit" class="button">
                <span>Submit</span>
            </button>
        </div>
    </form>
</div>

<style lang="postcss">
    @reference 'tailwindcss';

    h1 {
        @apply mb-6 text-lg font-semibold leading-9;
    }

    .field {
        @apply mb-4;

        .input {
            @apply block w-full;
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

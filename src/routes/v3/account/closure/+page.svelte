<div class="content-wrapper">
    <h1>Request for Account Closure</h1>

    <form action="">
        <div class="sub-container">
            <!-- Date -->
            <div class="field">
                <label for="pullout-date" class="field-label">Request date for pullout</label>
                <input id="pullout-date" type="date" class="input">
            </div>

            <!-- Reason -->
            <div class="field">
                <label for="concern" class="field-label">Reason for account closure</label>
                <textarea id="concern" class="input" placeholder="Please tell us why you are closing your account" rows="4"></textarea>
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
	  @apply mt-0! mb-6;
	}

	.field {
		@apply mb-4;

		.input {
		  @apply block w-full border rounded-md p-2 text-sm;
		}

		textarea.input {
		  @apply min-h-25;
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

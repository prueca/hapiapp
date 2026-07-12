<div class="content-wrapper">
    <h1>Apply for New Account</h1>

	<form action="">
		<div class="sub-container">
			<!-- First Name -->
			<div class="field">
				<label for="first-name" class="field-label">First Name</label>
				<input id="first-name" type="text" class="input" placeholder="Enter name">
			</div>

			<!-- Middle Name -->
			<div class="field">
				<label for="middle-name" class="field-label">Middle Name</label>
				<input id="middle-name" type="text" class="input" placeholder="Enter name">
			</div>

			<!-- Last Name -->
			<div class="field">
				<label for="last-name" class="field-label">Last Name</label>
				<input id="last-name" type="text" class="input" placeholder="Enter name">
			</div>

			<!-- Merchandise Name -->
			<div class="field">
				<label for="merchandise-name" class="field-label">Merchandise Name</label>
				<input id="merchandise-name" type="text" class="input" placeholder="Enter name">
			</div>

			<!-- Address -->
			<div class="field">
				<label for="address" class="field-label">Address</label>
				<input id="address" type="text" class="input" placeholder="Enter address">
			</div>

			<!-- Phone -->
			<div class="field">
				<label for="phone" class="field-label">Phone</label>
				<input id="phone" type="tel" class="input" placeholder="Enter phone no.">
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

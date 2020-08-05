<script>
	export let secondary = false;
	export let disabled = false;
</script>

<button on:click class:secondary {disabled}>
	<slot></slot>
</button>

<style lang='scss'>
	button {
		background-color: darkorange;
		border: none;
		border-radius: 5px;
		color: white;
		padding: 0.5rem 1rem;
		margin: 2rem 0 1rem;
		max-width: 12rem;
		font-size: 1.2rem;
		font-weight: bold;
		text-align: center;
		text-transform: uppercase;
		text-decoration: none;
		display: inline-block;
		cursor: pointer;

		&:hover {
			background-color: orange;
		}

		&:disabled {
			color: darkgrey;
			background-color: lightgrey;
			cursor: not-allowed;
		}
	}

	button.secondary {
		color: darkorange;
		background: transparent;
		border: darkorange
	}
</style>

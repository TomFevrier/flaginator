<script>
	export let secondary = false;
	export let disabled = false;
	export let margin = '2rem';
</script>

<button
	style='margin-top: {margin}'
	class:secondary {disabled}
	on:click
>
	<slot></slot>
</button>

<style lang='scss'>
	button {
		background-color: darkorange;
		border: none;
		border-radius: 5px;
		color: white;
		padding: 0.5rem 1rem;
		margin: 0.5rem 0 0.5rem;
		max-width: 12rem;
		font-size: 1.1rem;
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

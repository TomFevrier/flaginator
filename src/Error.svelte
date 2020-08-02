<script>
	import { createEventDispatcher } from 'svelte';

	import Card from './Card.svelte';

	const dispatch = createEventDispatcher();
	const retry = () => {
		dispatch('retry');
	}
</script>

<Card>
	<h3>I don't know this flag... Are you sure it exists?</h3>
	<button on:click={retry}>
		Identify another flag
	</button>
</Card>

<style lang='scss'>
	button {
		margin-top: 2rem;
		cursor: pointer;
	}
</style>

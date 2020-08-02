<script>
	import { createEventDispatcher } from 'svelte';

	import Card from './Card.svelte';

	export let found;

	const dispatch = createEventDispatcher();
	const retry = () => {
		dispatch('retry');
	}

</script>

<Card>
	<h3>Is it {found.name.toUpperCase()}?</h3>
	<img src='/assets/flags/{found.code.toLowerCase()}.png' />
	<button on:click={retry}>
		Identify another flag
	</button>
</Card>

<style lang='scss'>
	img {
		display: block;
		margin: 0 auto;
		width: 200px;
	}

	button {
		margin-top: 2rem;
		cursor: pointer;
	}
</style>

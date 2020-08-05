<script>
	import { createEventDispatcher } from 'svelte';

	import Card from './Card.svelte';
	import Button from './Button.svelte';

	export let notFound;

	const dispatch = createEventDispatcher();
	const retry = () => {
		dispatch('retry');
	}
</script>

<Card>
	{#if notFound}
		<h3>I don't know this flag... Are you sure it exists?</h3>
	{:else}
		<h3>I need more information to identify this flag...</h3>
	{/if}
	<Button on:click={retry}>
		Retry
	</Button>
</Card>

<style lang='scss'>
	button {
		margin-top: 2rem;
		cursor: pointer;
	}
</style>

<script>
	import { createEventDispatcher } from 'svelte';

	import Card from './Card.svelte';
	import Button from './Button.svelte';

	import { translations } from '../locales/locale';

	export let notFound;

	const dispatch = createEventDispatcher();
	const retry = () => {
		dispatch('retry');
	}
</script>

<Card>
	{#if notFound}
		<h3>{@html translations.errorNotFound}</h3>
	{:else}
		<h3>{@html translations.errorImprecise}</h3>
	{/if}
	<Button on:click={retry}>
		{translations.retry}
	</Button>
</Card>

<style>
	h3 {
		font-size: 1.2rem;
		text-align: center;
		font-weight: bold;
		max-width: 30rem;
	}
</style>

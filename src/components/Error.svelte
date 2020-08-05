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
		<h3>{translations.errorNotFound}</h3>
	{:else}
		<h3>{translations.errorImprecise}</h3>
	{/if}
	<Button on:click={retry}>
		{translations.retry}
	</Button>
</Card>

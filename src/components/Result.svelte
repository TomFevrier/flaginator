<script>
	import { createEventDispatcher } from 'svelte';

	import Card from './Card.svelte'
	import Button from './Button.svelte';

	import { lang, translations } from '../locales/locale';

	export let found;

	const dispatch = createEventDispatcher();
	const retry = () => {
		dispatch('retry');
	}

</script>

<Card>
	{#if lang === 'fr'}
		<h3>S'agit-il {found[0].prep}{found[0].nom.toUpperCase()}&nbsp;?</h3>
	{:else}
		<h3>Is this {found[0].name.toUpperCase()}?</h3>
	{/if}
	<img src='https://flagcdn.com/w320/{found[0].code.toLowerCase()}.png' alt={found[0].name} />
	{#if found.length > 1}
		<div class='alternative-results-wrapper'>
			<p>{translations[found.length === 2 ? 'alternativeFlag' : 'alternativeFlags']}</p>
			<div class='alternative-results'>
				{#each found.slice(1) as result}
					<div>
						<img src='https://flagcdn.com/w160/{result.code.toLowerCase()}.png' alt={result.name} />
						<p>{lang === 'fr' ? result.nom : result.name}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}
	<Button on:click={retry}>
		{translations.identifyAnother}
	</Button>
</Card>

<style lang='scss'>
	img {
		display: block;
		margin: 0 auto;
		width: 200px;
	}

	.alternative-results-wrapper {

		margin-top: 2rem;

		p {
			text-align: center;
			font-weight: 800;
			margin: 0;
		}

		.alternative-results {
			display: flex;
			justify-content: center;
			width: 100%;

			div {
				display: flex;
				flex-direction: column;
				justify-content: end;
				align-items: center;

				img {
					width: 100px;
					margin: 0.5rem 1rem;
				}

				p {
					font-weight: normal;
				}
			}
		}
	}
</style>

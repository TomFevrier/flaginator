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
	<h3>Is this {found[0].name.toUpperCase()}?</h3>
	<img src='/assets/flags/{found[0].code.toLowerCase()}.png' alt={found[0].name} />
	{#if found.length > 1}
		<div class='alternative-results-wrapper'>
			<p>Alternative flags</p>
			<div class='alternative-results'>
				{#each found.slice(1) as result}
					<div>
						<img src='/assets/flags/{result.code.toLowerCase()}.png' alt={result.name} />
						<p>{result.name}</p>
					</div>
				{/each}
			</div>
		</div>
	{/if}
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

	button {
		margin-top: 2rem;
		cursor: pointer;
	}
</style>

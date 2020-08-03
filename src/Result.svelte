<script>
	import { createEventDispatcher } from 'svelte';

	import Card from './Card.svelte';

	export let found;

	console.log(found)

	const dispatch = createEventDispatcher();
	const retry = () => {
		dispatch('retry');
	}

</script>

<Card>
	<h3>Is it {found[0].name.toUpperCase()}?</h3>
	<img src='/assets/flags/{found[0].code.toLowerCase()}.png' />
	{#if found.length > 1}
		<div class='alternative-results'>
			<p>Alternative results</p>
			<div>
				{#each found.slice(1) as result}
					<img src='/assets/flags/{result.code.toLowerCase()}.png' />
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

	.alternative-results {
		div {
			display: flex;
			justify-content: center;
			width: 100%;

			img {
				width: 100px;
				margin: 1rem;
			}
		}
	}

	button {
		margin-top: 2rem;
		cursor: pointer;
	}
</style>

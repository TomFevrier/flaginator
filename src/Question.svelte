<script>
	import { createEventDispatcher } from 'svelte';

	import Card from './Card.svelte';

	export let property;
	export let options;
	export let multiple = false;
	export let filtered;
	export let selected;

	if (property === 'nbBars') {
		options = options.filter(option => filtered[0].layout.some(e => option.startsWith(e)));
		console.log(options)
	}

	const clickHandler = (value) => {
		if (multiple) {
			selected = (selected.includes(value))
				? selected.filter(e => e !== value)
				: [...selected, value];
		}
		else {
			selected = [value];
		}
	}

	const dispatch = createEventDispatcher();
	const submit = () => {
		dispatch('submit');
	}

	const skip = () => {
		dispatch('skip');
	}
</script>

<Card>
	<h3>{property.toUpperCase()}</h3>
	<div class='grid'>
		{#each options as option}
			{#if property === 'colors'}
				<div
					class='option {selected.includes(option) ? 'selected' : ''}'
					style='background-color: {option}; padding-top: calc(100% * 2/3);'
					on:click={() => clickHandler(option)}
				></div>
			{:else}
				<div
					class='option {selected.includes(option) ? 'selected' : ''}'
					on:click={() => clickHandler(option)}
				>
					<img src='/assets/{property}/{option}.png' />
				</div>
			{/if}
		{/each}
	</div>
	<div>
		<button on:click={skip} class='skip'>
			Skip
		</button>
		<button on:click={submit} disabled={selected.length == 0}>
			Next
		</button>
	</div>
</Card>

<style lang='scss'>
	.grid {
		width: 100%;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
		gap: 0.5rem;

		.option {
			width: auto;
			cursor: pointer;

			&:hover {
				opacity: 1;
			}

			&.selected {
				outline: 2px solid green;
			}

			img {
				width: 100%;
				height: 100%;
			}
		}
	}

	button {
		margin-top: 2rem;
		cursor: pointer;
	}

	button.skip {
		border: none;
		background-color: transparent;
		color: grey;
	}
</style>

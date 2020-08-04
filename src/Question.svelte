<script>
	import { createEventDispatcher } from 'svelte';

	import Card from './Card.svelte';

	export let property;
	export let propertyOptions;
	export let filtered;
	export let selected;

	const dispatch = createEventDispatcher();

	if (property === 'nbBands') {
		propertyOptions.options = propertyOptions.options.filter(option => filtered.some(e => option.value.startsWith(e.layout)));
	}

	const clickHandler = (value) => {
		if (propertyOptions.multiple) {
			selected = (selected.includes(value))
				? selected.filter(e => e !== value)
				: [...selected, value];
		}
		else {
			selected = [value];
		}
	}

	const submit = () => {
		dispatch('submit');
	}

	const skip = () => {
		dispatch('skip');
	}
</script>

<Card>
	<h3>{propertyOptions.question}</h3>
	<div class='grid'>
		{#each propertyOptions.options as option}
			<div class='option'>
				{#if property === 'colors'}
					<div
						class='option-image'
						class:selected={selected.includes(option.value)}
						style='background-color: {option.value}; padding-top: calc(100% * 2/3);'
						on:click={() => clickHandler(option.value)}
					></div>
				{:else}
						<div
							class='option-image'
							class:selected={selected.includes(option.value)}
							on:click={() => clickHandler(option.value)}
						>
							<img src='/assets/{property}/{option.value}.png' alt={option.label} />
						</div>
						<p>{option.label}</p>
				{/if}
			</div>
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
			display: flex;
			flex-direction: column;
			justify-content: flex-start;
			align-items: center;

			.option-image {
				width: 100%;
				cursor: pointer;

				&:hover {
					opacity: 1;
				}

				&.selected {
					outline: 2px solid green;
				}

				img {
					height: 100%;
					max-width: 100%;
					max-height: 100px;
				}
			}

			p {
				font-size: 1rem;
				text-align: center;
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

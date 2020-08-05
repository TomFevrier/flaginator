<script>
	import { createEventDispatcher } from 'svelte';

	import Card from './Card.svelte';
	import Button from './Button.svelte';

	import { translations } from '../locales/locale';

	export let property;
	export let propertyOptions;
	export let filtered;
	export let selected;

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

	const dispatch = createEventDispatcher();

	const submit = () => {
		dispatch('submit');
	}

	const skip = () => {
		dispatch('skip');
	}

	const retry = () => {
		dispatch('retry');
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
						style='
							background-color: {option.value};
							padding-top: calc(100% * 2/3);
						'
						on:click={() => clickHandler(option.value)}
					></div>
				{:else}
						<div
							class='option-image'
							class:selected={selected.includes(option.value)}
							style='
								background-image: url(/assets/{property}/{option.value}_small.png);
								padding-top: calc(100% * 2/3);
							'
							on:click={() => clickHandler(option.value)}
						>
							<!-- <img src='' alt={option.label} /> -->
						</div>
						<p class='option-label'>{option.label}</p>
				{/if}
			</div>
		{/each}
	</div>
	<div>
		<Button on:click={skip} secondary>
			{translations.skip}
		</Button>
		<Button on:click={retry} secondary>
			{translations.retry}
		</Button>
		<Button on:click={submit} disabled={selected.length == 0}>
			{translations.next}
		</Button>
	</div>
</Card>

<style lang='scss'>
	h3 {
		font-size: 1.5rem;
		font-weight: bold;
	}
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
				background-size: cover;
				cursor: pointer;

				&:hover {
					opacity: 1;
				}

				&.selected {
					outline: 3px solid darkorange;
				}

				img {
					height: 100%;
					max-width: 100%;
					max-height: 100px;
				}
			}

			.option-label {
				margin: 0.5rem 0 1rem;
				font-size: 1rem;
				text-align: center;
				line-height: 100%;
			}
		}
	}
</style>

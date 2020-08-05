<script>
	import { csv } from 'd3-fetch';
	import { mean } from 'd3-array';

	import LoadingScreen from './components/LoadingScreen.svelte';
	import Menu from './components/Menu.svelte';
	import Question from './components/Question.svelte';
	import Result from './components/Result.svelte';
	import Error from './components/Error.svelte';

	import { options } from './locales/locale.js';

	const properties = [
		'layout',
		'colors',
		'figures',
		'nbStars',
		'nbBands'
	];

	let flags = [];

	let filtered = [];
	$: console.log(filtered)

	let flagImages = [];
	let nbFlagImagesLoaded = 0;
	// $: console.log(flagImages, nbFlagImagesLoaded);
	$: loaded = flags.length > 0 && nbFlagImagesLoaded === flags.length;

	let property = properties[0];
	let selected = [];
	let knownProperties = {};

	let started = false;

	let loading = true;

	csv('./flags.csv').then(data => {
		data.forEach(e => {
			e.nbStars = +e.nbStars;
			if (e.nbStars > 1 && e.nbStars <= 5)
				e.nbStars = 2;
			else if (e.nbStars > 5)
				e.nbStars = 6;
			e.layout = e.layout.split(',');
			e.colors = e.colors.split(',');
			e.figures = e.figures.split(',').map(d => d === '' ? 'none' : d);
			const img = new Image();
			img.src = `assets/flags/${e.code.toLowerCase()}.png`;
			img.addEventListener('load', () => nbFlagImagesLoaded++);
			flagImages.push(img);
		})
		flags = data;
		filtered = flags;
		loading = false;
	});

	const getNextProperty = () => {
		/*
		Compute available properties:
		- properties not already known
		- 'nbStars' only if 'figures' is already known and if the flag contains stars
		- 'nbBands' only if 'layout' is already knozn and if the flag contains bands
		*/
		const availableProperties = properties
			.filter(e => !Object.keys(knownProperties).includes(e))
			.filter(e => !knownProperties.figures || !knownProperties.figures.includes('star') ? e !== 'nbStars' : e)
			.filter(e => !knownProperties.layout || !knownProperties.layout.some(e => e.startsWith('bands')) ? e !== 'nbBands' : e);
		console.log(knownProperties, availableProperties)
		if (availableProperties.length === 0) return;

		// For each available property, compute the average number of filtered flags depending on the option chosen (only one option is considered)
		const averages = availableProperties.reduce((acc, property) => {
			// If every flag in filtered has the exact same value(s) for the given property, don't bother
			if (filtered.every(e => {
				const propertyName = property === 'nbBands' ? 'layout' : property;
				if (Array.isArray(e[propertyName]) && e[propertyName].length === filtered[0][propertyName].length && e[propertyName].every(e1 => filtered[0][propertyName].some(e2 => e1 === e2)))
					return true;
				if (!Array.isArray(e[propertyName]) && e[propertyName] == filtered[0][propertyName])
					return true;
				return false;
			})) return acc;
			// If the property is 'nbBands', only use options for vertical or horizontal (depending on the known layout)
			const propertyOptions = options[property].options.filter(option => property === 'nbBands' ? option.value.startsWith(knownProperties.layout) : option);
			const sum = propertyOptions.reduce((acc, option) => {
				return acc + filtered.filter(e => {
					const value = e[property === 'nbBands' ? 'layout' : property];
					if (Array.isArray(value))
						return value.some(e => e.includes(option.value));
					return value === option.value;
				}).length;
			}, 0);
			return { ...acc, [property]: sum / propertyOptions.length };
		}, {});

		// Return if no interesting property, or return the property with the smallest average
		if (Object.keys(averages).length === 0) return;
		return Object.entries(averages).sort((a, b) => a[1] - b[1])[0][0];
	}

	const filterFlags = () => {
		loading = true;
		if (options[property].multiple) {
			filtered = filtered.filter(e => selected.reduce((acc, value) => acc && e[property].some(e => e.includes(value)), true));
			knownProperties = {
				...knownProperties,
				[property]: selected
			};
		}
		else {
			filtered = filtered.filter(e => {
				if (property === 'nbBands')
					return e.layout.includes(selected[0]);
				return e[property] === selected[0];
			});
			knownProperties = {
				...knownProperties,
				[property]: selected[0]
			};
		}
		property = getNextProperty();
		selected = [];
		setTimeout(() => loading = false, 0);
	}

	const skipQuestion = () => {
		loading = true;
		selected = [];
		knownProperties = { ...knownProperties, [property]: undefined };
		property = getNextProperty();
		setTimeout(() => loading = false, 0);
	}

	const retry = () => {
		loading = true;
		selected = [];
		knownProperties = {};
		property = properties[0];
		filtered = flags;
		setTimeout(() => loading = false, 0);
	}

</script>


{#if !started}
	<Menu {flags} on:start={() => started = true} />
	<LoadingScreen hidden={loaded} />
{:else if started && !loading}
	{#if property && filtered.length > 1}
		<Question
			property={property}
			propertyOptions={options[property]}
			filtered={filtered}
			bind:selected={selected}
			on:submit={filterFlags}
			on:skip={skipQuestion}
			on:retry={retry}
		/>
	{:else if filtered.length > 0 && filtered.length <= 3}
		<Result found={filtered} on:retry={() => {
			filtered = flags;
			knownProperties = {};
			property = properties[0];
		}} />
	{:else}
		<Error notFound={filtered.length === 0} on:retry={retry} />
	{/if}
	<!-- {#each flags as flag}
		<img src='/assets/flags/{flag.code.toLowerCase()}.png' />
	{/each} -->
{/if}

<style lang='scss'>
	@import './global.scss';

	main {
		text-align: center;
		padding: 1em;
		width: 75%;
		margin: 0 auto;

		h1 {
			text-transform: uppercase;
			font-size: 4em;
			font-weight: 400;
		}

		h3 {
			font-size: 1.4rem;
			font-weight: 400;
			color: #c69;
		}

		img {
			margin: 0 auto;
		}

		.logo-large {
			display: inline-block;
			vertical-align: -1.5rem;
			width: 8rem;
		}

		.logo-small {
			display: none;
		}

		@include md {
			width: 100%;

			h3 {
				font-size: 1.2rem;
			}

			.logo-small {
				display: inline-block;
				vertical-align: middle;
				width: 3rem;
				padding: 0.2rem;
			}

			.logo-large {
				display: none;
			}
		}
	}
</style>

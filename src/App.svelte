<script>
	import { csv } from 'd3-fetch';
	import { mean } from 'd3-array';

	import Background from './Background.svelte';
	import Question from './Question.svelte';
	import Result from './Result.svelte';
	import Error from './Error.svelte';

	import options from './options';

	let loading = true;

	let flags = [];
	let filtered = [];
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
		})
		flags = data;
		filtered = flags;
		loading = false;
		// flags.forEach((flag1, i) => flags.forEach((flag2, j) => {
		// 	if (j <= i) return
		// 	if (flag1.nbBars === flag2.nbBars && flag1.nbStars === flag2.nbStars
		// 		&& flag1.layout.length === flag2.layout.length && flag1.layout.every(e1 => flag2.layout.some(e2 => e1 === e2))
		// 		&& flag1.colors.length === flag2.colors.length && flag1.colors.every(e1 => flag2.colors.some(e2 => e1 === e2))
		// 		&& flag1.figures.length === flag2.figures.length && flag1.figures.every(e1 => flag2.figures.some(e2 => e1 === e2)))
		// 		console.log(flag1.name, flag2.name);
		// }));
		// console.log(Array.from(new Set(flags.reduce((acc, value) => [...acc, ...value.figures], []))))
		// console.log(flags.filter(e => e.figures.includes("misc")))
	});

	$: console.log({filtered});

	let selected = [];
	$: console.log(selected);

	let knownProperties = {};
	const properties = [
		'layout',
		'colors',
		'figures',
		'nbStars',
		'nbBars'
	];

	let property = 'layout';

	let mobile = window.matchMedia('(orientation: portrait)').matches;
	window.addEventListener('resize', () => {
		mobile = window.matchMedia('(orientation: portrait)').matches;
	});

	$: isMultiple = ['layout', 'colors', 'figures'].includes(property);

	$: isAmbiguous = filtered.every((flag1, i) => filtered.every((flag2, j) => {
		if (j <= i) return true;
		return (flag1.nbBars === flag2.nbBars && flag1.nbStars === flag2.nbStars
			&& flag1.layout.length === flag2.layout.length && flag1.layout.every(e1 => flag2.layout.some(e2 => e1 === e2))
			&& flag1.colors.length === flag2.colors.length && flag1.colors.every(e1 => flag2.colors.some(e2 => e1 === e2))
			&& flag1.figures.length === flag2.figures.length && flag1.figures.every(e1 => flag2.figures.some(e2 => e1 === e2)))
	}));

	const getNextProperty = () => {
		/*
		Compute available properties:
		- properties not already known
		- 'nbStars' only if 'figures' is already known and if the flag contains stars
		- 'nbBars' only if 'layout' is already knozn and if the flag contains bars
		*/
		const availableProperties = properties
			.filter(e => !Object.keys(knownProperties).includes(e))
			.filter(e => !knownProperties.figures || !knownProperties.figures.includes('star') ? e !== 'nbStars' : e)
			.filter(e => !knownProperties.layout || !knownProperties.layout.some(e => e.startsWith('bars')) ? e !== 'nbBars' : e);
		console.log(availableProperties)

		if (availableProperties.length === 0) return;

		// For each available property, compute the average number of filtered flags depending on the option chosen (only one option is considered)
		const averages = availableProperties.reduce((acc, property) => {
			console.log(property)
			if (filtered.every(e => {
				const propertyName = property === 'nbBars' ? 'layout' : property;
				console.log(propertyName, filtered[0])
				if (Array.isArray(e[propertyName]) && e[propertyName].length === filtered[0][propertyName].length && e[propertyName].every(e1 => filtered[0][propertyName].some(e2 => e1 === e2)))
					return true;
				if (!Array.isArray(e[propertyName]) && e[propertyName] == filtered[0][propertyName])
					return true;
				return false;
			})) return { ...acc, [property]: Infinity };
			// If the property is 'nbBars', only use options for vertical or horizontal (depending on the known layout)
			const propertyOptions = options[property].filter(e => property === 'nbBars' ? e.startsWith(knownProperties.layout) : e);
			const sum = propertyOptions.reduce((acc, option) => {
				console.log(option, filtered.filter(e => {
					const value = e[property === 'nbBars' ? 'layout' : property];
					if (Array.isArray(value))
						return value.some(e => e.includes(option));
					return value === option;
				}))
				return acc + filtered.filter(e => {
					const value = e[property === 'nbBars' ? 'layout' : property];
					if (Array.isArray(value))
						return value.some(e => e.includes(option));
					return value === option;
				}).length;
			}, 0);
			return { ...acc, [property]: sum / propertyOptions.length };
		}, {});
		console.log(averages)
		// Return the property with the smallest average
		return Object.entries(averages).sort((a, b) => a[1] - b[1])[0][0];
	}

	const filterFlags = () => {
		loading = true;
		console.log(selected, property, isMultiple)
		if (isMultiple) {
			filtered = filtered.filter(e => selected.reduce((acc, value) => acc && e[property].some(e => e.includes(value)), true));
			knownProperties = {
				...knownProperties,
				[property]: selected
			};
		}
		else {
			filtered = filtered.filter(e => {
				if (property === 'nbBars')
					return e.layout.includes(selected[0]);
				return e[property] === selected[0];
			});
			knownProperties = {
				...knownProperties,
				[property]: selected[0]
			};
		}
		console.log(filtered)
		console.log(knownProperties)
		console.log(isAmbiguous)
		property = getNextProperty();
		selected = [];
		setTimeout(() => loading = false, 0);

	}

	const skipQuestion = () => {
		loading = true;
		selected = [];
		knownProperties = [...knownProperties, property];
		property = getNextProperty();
		setTimeout(() => loading = false, 0);

	}

</script>

{#if !mobile}
	<Background flags={flags} />
{/if}
{#if !loading}
	{#if property && filtered.length > 1}
		<Question
			property={property}
			options={options[property]}
			multiple={isMultiple}
			filtered={filtered}
			bind:selected={selected}
			on:submit={filterFlags}
			on:skip={skipQuestion}
		/>
	{:else if filtered.length <= 3}
		<Result found={filtered} on:retry={() => {
			filtered = flags;
			knownProperties = [];
			property = 'layout';
		}} />
	{:else}
		<Error on:retry={() => {
			filtered = flags;
			knownProperties = [];
			property = 'layout';
		}} />
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

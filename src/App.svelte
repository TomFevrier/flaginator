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
			e.nbBars = Math.min(+e.nbBars, 4);
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
		console.log(Array.from(new Set(flags.reduce((acc, value) => [...acc, ...value.figures], []))))
		console.log(flags.filter(e => e.figures.includes("misc")))
	});

	$: console.log(filtered);

	let selected = [];
	$: console.log(selected);

	let usedProperties = {};
	const properties = [
		'layout',
		'colors',
		'figures',
		'nbBars',
		'nbStars'
	];
	let index = 0;
	$: property = properties[index];

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
		const availableProperties = properties
			.filter(e => !Object.keys(usedProperties).includes(e))
			.filter(e => !usedProperties.figures || !usedProperties.figures.includes('star') ? e !== 'nbStars' : e)
			.filter(e => !usedProperties.layout || !usedProperties.layout.some(e => e.startsWith('bars')) ? e !== 'nbBars' : e);
		console.log(availableProperties)
		const averages = availableProperties.map(property => {
			const sum = options[property].reduce((acc, option) => {
				console.log(property === 'nbBars' ?  +option.match(/\d/)[0] : option, filtered.filter(e => {
					if (Array.isArray(e[property]))
						return e[property].includes(property === 'nbBars' ?  +option.match(/\d/)[0] : option);
					return e[property] === option
				}).length)
				return acc + filtered.filter(e => {
					if (Array.isArray(e[property]))
						return e[property].includes(property === 'nbBars' ?  +option.match(/\d/)[0] : option);
					return e[property] === option
				}).length;
			}, 0);
			return { [property]: sum / options[property].length };
		});
		console.log(averages)
	}

	const filterFlags = () => {
		loading = true;
		if (property === 'nbBars')
			selected = selected.map(e => +option.match(/\d/)[0]);
		console.log(selected, property, isMultiple)
		if (isMultiple) {
			filtered = filtered.filter(e => selected.reduce((acc, value) => acc && e[property].includes(value), true));
			usedProperties = {
				...usedProperties,
				[property]: selected
			};
		}
		else {
			filtered = filtered.filter(e => e[property] === selected[0]);
			usedProperties = {
				...usedProperties,
				[property]: selected[0]
			};
		}
		console.log(filtered)
		console.log(usedProperties)
		console.log(isAmbiguous)
		getNextProperty();
		// if (property === 'layout' && !selected.some(e => e.startsWith('bars')))
		// 	properties = properties.filter(e => e !== 'nbBars');
		selected = [];
		if (filtered.length > 1 && index < properties.length - 1)
			index++;
		else if (index >= properties.length - 1)
			filtered = [];
		setTimeout(() => loading = false, 0);

	}

	const skipQuestion = () => {
		loading = true;
		selected = [];
		usedProperties = [...usedProperties, property];
		if (filtered.length > 1 && index < properties.length - 1)
			index++;
		setTimeout(() => loading = false, 0);

	}

</script>

{#if !mobile}
	<Background flags={flags} />
{/if}
{#if !loading}
	{#if filtered.length > 1}
		<Question
			property={property}
			options={options[property]}
			multiple={isMultiple}
			filtered={filtered}
			bind:selected={selected}
			on:submit={filterFlags}
			on:skip={skipQuestion}
		/>
	{:else if filtered.length === 1}
		<Result found={filtered[0]} on:retry={() => {
			filtered = flags;
			usedProperties = [];
			index = 0;
		}} />
	{:else}
		<Error on:retry={() => {
			filtered = flags;
			usedProperties = [];
			index = 0;
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

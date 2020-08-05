<script>
	import { createEventDispatcher } from 'svelte';

	import Background from './Background.svelte';
	import GIF from './GIF.svelte';
	import Card from './Card.svelte';
	import Button from './Button.svelte';

	import { translations } from '../locales/locale';

	export let flags;

	let mobile = window.matchMedia('(orientation: portrait)').matches;
	window.addEventListener('resize', () => {
		mobile = window.matchMedia('(orientation: portrait)').matches;
	});

	const dispatch = createEventDispatcher();
	const start = () => {
		dispatch('start');
	}
</script>

{#if !mobile}
	<Background {flags} />
{/if}
<Card>
	<h3>flaginator</h3>
	<h4>{translations.intro}</h4>
	{#if mobile}
		<GIF {flags} />
	{/if}
	<Button on:click={start}>
		{translations.start}
	</Button>
</Card>

<style lang='scss'>
	@font-face {
		font-family: 'Minangkabau';
		src: url('../assets/Minangkabau.woff') format('woff');
		font-display: fallback;
	}

	h3 {
		font: 5rem 'Minangkabau', sans-serif;
		color: transparent;
		background: linear-gradient(yellow, darkorange);
		background-clip: text;
		margin: 1rem;
	}

	h4 {
		text-align: center;
		font-size: 1.2rem;
	}
</style>

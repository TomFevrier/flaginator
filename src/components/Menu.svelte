<script>
	import { createEventDispatcher } from 'svelte';

	import Background from './Background.svelte';
	import Card from './Card.svelte';
	import Button from './Button.svelte';

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
	<Background flags={flags} />
{/if}
<Card>
	<h3>flaginator</h3>
	<p>Identify any flag</p>
	<Button on:click={start}>
		Start
	</Button>
</Card>

<style lang='scss'>
	@font-face {
		font-family: 'Minangkabau';
		src: url('../assets/Minangkabau.woff') format('woff');
	}

	h3 {
		font: 5rem 'Minangkabau', sans-serif;
		color: transparent;
		background: linear-gradient(yellow, darkorange);
		background-clip: text;
		margin: 1rem;
	}

	button {
		margin-top: 2rem;
		cursor: pointer;
	}
</style>

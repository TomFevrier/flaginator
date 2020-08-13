<script>
	import { createEventDispatcher } from 'svelte';

	import Card from './Card.svelte'
	import Button from './Button.svelte';

	import { lang, translations } from '../locales/locale';

	export let found;
	export let knownProperties;

	const getAbsoluteDifference = (flag) => {
		return Object.keys(knownProperties)
			.reduce((acc, property) => {
				return Array.isArray(knownProperties[property])
					? acc + flag[property].length - knownProperties[property].length
					: acc
			}, 0);
	}

	$: found.sort((a, b) => getAbsoluteDifference(a) - getAbsoluteDifference(b));

	let loading = false;
	let index = 0;

	const dispatch = createEventDispatcher();
	const retry = () => {
		dispatch('retry');
	}

	const showNext = () => {
		loading = true;
		index++;
		setTimeout(() => loading = false, 0);
	}

</script>

{#if !loading}
	<Card>
		{#if lang === 'fr'}
			<h3>S’agit-il {found[index].prep}{found[index].nom.toUpperCase()}&nbsp;?</h3>
		{:else}
			<h3>Is this {found[index].name.toUpperCase()}?</h3>
		{/if}
		<img src='https://flagcdn.com/w320/{found[index].code.toLowerCase()}.png' alt={found[index].name} />
		<div class='buttons'>
			{#if index < found.length - 1}
				<Button
					secondary
					margin='0.5rem'
					on:click={showNext}
				>
					{translations.notCorrect}
				</Button>
			{/if}
			<Button
				margin='0.5rem'
				on:click={retry}
			>
				{translations.identifyAnother}
			</Button>
		</div>
	</Card>
{/if}

<style lang='scss'>
	@import './global.scss';

	img {
		display: block;
		margin: 0 auto;
		width: 200px;
	}

	.buttons {
		margin-top: 2rem;
		display: flex;
		flex-direction: row;
		justify-content: center;

		@include md {
			flex-direction: column-reverse;
		}
	}
</style>

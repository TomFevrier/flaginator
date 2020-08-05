<script>
	export let flags = [];

	$: flags.sort(() => Math.random() >= 0.5);

	let index = 0;

	setInterval(() => index = (index + 1) % flags.length, 500);

</script>

{#if flags.length > 0}
	<div class='gif'>
		<img src='https://flagcdn.com/w160/{flags[index].code.toLowerCase()}.png' alt={flags[index].name} />
	</div>
{/if}

<style lang='scss'>
	.gif {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 6rem;

		img {
			width: auto;
			height: 100%;
		}
	}


</style>

<script>
	export let flags;

	$: flags.sort(() => Math.random() >= 0.5);

	const NB_FLAGS = 42;
</script>

<div class='background-wrapper'>
	{#each new Array(2) as _}
		<div class='group'>
			<div class='row'>
				{#each flags.slice(0, NB_FLAGS) as flag}
					<img
						src='assets/flags/{flag.code.toLowerCase()}_xsmall.png'
						style='width: calc(200vw / {NB_FLAGS});'
						alt={flag.name}
					/>
				{/each}
				{#each flags.slice(0, NB_FLAGS * 0.5) as flag}
					<img
						src='assets/flags/{flag.code.toLowerCase()}_xsmall.png'
						style='width: calc(200vw / {NB_FLAGS});'
						alt={flag.name}
					/>
				{/each}
			</div>
			<div class='row'>
				{#each flags.slice(NB_FLAGS, NB_FLAGS * 2) as flag}
					<img
						src='assets/flags/{flag.code.toLowerCase()}_xsmall.png'
						style='width: calc(200vw / {NB_FLAGS});'
						alt={flag.name}
					/>
				{/each}
				{#each flags.slice(NB_FLAGS, NB_FLAGS * 1.5) as flag}
					<img
						src='assets/flags/{flag.code.toLowerCase()}_xsmall.png'
						style='width: calc(200vw / {NB_FLAGS});'
						alt={flag.name}
					/>
				{/each}
			</div>
			<!-- <div class='row'>
				{#each flags.slice(NB_FLAGS * 2, NB_FLAGS * 3) as flag}
					<img
						src='assets/flags/{flag.code.toLowerCase()}_xsmall.png'
						style='width: calc(200vw / {NB_FLAGS});'
						alt={flag.name}
					/>
				{/each}
				{#each flags.slice(NB_FLAGS * 2, NB_FLAGS * 2.5) as flag}
					<img
						src='assets/flags/{flag.code.toLowerCase()}_xsmall.png'
						style='width: calc(200vw / {NB_FLAGS});'
						alt={flag.name}
					/>
				{/each}
			</div> -->
		</div>
	{/each}
</div>

<style lang='scss'>
	.background-wrapper {
		width: 300vw;
		height: 100%;
		opacity: 0.2;
		position: absolute;
		top: 0;
		left: 0;
		z-index: -1;

		.group {
			position: absolute;
			left: 0;

			.row {
				width: 100%;
				display: flex;
				align-items: center;

				img {
					margin: 1rem;
				}
			}

			&:nth-child(1) {
				top: 0;
				animation: marquee 60s linear infinite;
			}

			&:nth-child(2) {
				bottom: 0;
				animation: marquee 60s linear infinite reverse;
			}

			@keyframes marquee {
				from {
					left: 0;
				}
				to {
					left: -200vw;
				}
			}
		}
	}


</style>

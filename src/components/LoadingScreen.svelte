<script>
	export let hidden;

	console.log(hidden);
</script>

<div class='loading-screen' class:hidden>
	<div class='french-flag'>
		<div class='bar' style='background-color: darkblue;'></div>
		<div class='bar' style='background-color: white;'></div>
		<div class='bar' style='background-color: red;'></div>
	</div>
</div>

<style lang='scss'>
	.loading-screen {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: #c9beb8;
		pointer-events: none;

		.french-flag {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 9rem;
			height: 6rem;
			display: flex;
			align-items: center;

			.bar {
				width: 33.33%;
				height: 0;
				animation: animation ease-in-out 1s infinite alternate;

				&:nth-child(1) {
					animation-delay: 0;
				}

				&:nth-child(2) {
					animation-delay: 0.2s;
				}

				&:nth-child(3) {
					animation-delay: 0.4s;
				}
			}


		}
	}

	@keyframes animation {
		from {
			height: 0;
		}
		to {
			height: 100%;
		}
	}

	div.hidden {
		opacity: 0;
	}
</style>

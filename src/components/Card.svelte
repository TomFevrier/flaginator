<script>
	import { fade, fly } from 'svelte/transition';
</script>

<div class='card' in:fly={{ x: 500, duration: 1000 }}>
	<slot></slot>
</div>

<style lang='scss'>
	@import './global.scss';

	.card {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		width: 60%;
		max-width: 48rem;
		min-height: 50vh;
		padding: 2rem;
		background-color: white;
		border: 3px solid black;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		@include lg {
			width: 80%;
		}

		@include md {
			width: 100%;
			position: relative;
			top: 0;
			left: 0;
			transform: none;
			min-height: auto;
			border: none;
			background-color: #dfd9d5;
			padding: 1rem;

			&:before {
				display: none;
			}
		}

		&:before {
			content: " ";
			position: absolute;
			z-index: -1;
			top: 0.5rem;
			left: 0.5rem;
			right: 0.5rem;
			bottom: 0.5rem;
			border: 5px solid darkorange;
		}
	}
</style>

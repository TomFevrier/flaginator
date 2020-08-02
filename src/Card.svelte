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
		padding: 1rem;
		background-color: #e3e0ed;
		box-shadow: 2px 2px 2px black;
		display: flex;
		flex-direction: column;
		align-items: center;

		@include md {
			width: 80%;
		}

		@include sm {
			width: 100%;
		}
	}
</style>

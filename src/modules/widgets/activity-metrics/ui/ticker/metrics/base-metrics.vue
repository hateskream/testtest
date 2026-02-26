<script setup lang="ts">
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.metrics">
			<slot />
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: center;
	container-type: inline-size;
}

.metrics {
	display: grid;
	flex-grow: 1;
	max-width: 100%;
	grid-template-columns: repeat(2, 1fr);
	gap: 6px var(--padding-s4, 6px);
}

@container (width < 270px) {
	.metrics {
		display: flex;
		flex-direction: column;
		gap: 6px var(--padding-s4, 6px);
	}
}
</style>

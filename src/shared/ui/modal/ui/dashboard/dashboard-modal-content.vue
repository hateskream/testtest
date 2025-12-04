<script setup lang="ts">

</script>

<template>
	<div :class="classes.content" data-modal-content>
		<slot	/>
	</div>
</template>

<style module="classes">
.content {
	display: flex;
	flex-direction: column;
	gap: 2px;
	align-items: stretch;
	width: 100%;
	min-width: 230px;
	max-height: calc(80svh - 40px);
	padding: 6px;
	overflow-y: auto;
}

:global([data-modal-wrapper] > [data-pill-wrapper] ~ [data-modal-content]) {
	max-height: calc(80vh - 40px - 40px);
	padding: 0 6px 6px;
}

@supports (-moz-appearance: none) {
	.content:not(:hover) {
		scrollbar-width: none;
	}

	.content {
		scrollbar-width: unset;
	}
}

.content:not(:hover)::-webkit-scrollbar {
	display: none;
}

.content:hover::-webkit-scrollbar {
	width: 6px;
}
</style>

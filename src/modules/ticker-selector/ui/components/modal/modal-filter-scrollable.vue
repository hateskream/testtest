<script setup lang="ts">
</script>

<template>
	<div :class="classes.scrollable">
		<slot />
	</div>
</template>

<style module="classes">
.scrollable {
	display: flex;
	flex-direction: column;
	max-height: 450px;
	margin: 0 -6px;
	padding: 6px;
	overflow-y: auto;
}

@supports (-moz-appearance: none) {
	.scrollable:not(:hover) {
		scrollbar-width: none;
	}

	.scrollable {
		scrollbar-width: unset;
	}
}

.scrollable::-webkit-scrollbar {
	width: 6px;
}

.scrollable:not(:hover)::-webkit-scrollbar-thumb {
	background: transparent;
}

.scrollable:not(:hover)::-webkit-scrollbar-track {
	background: transparent;
}

.scrollable:hover::-webkit-scrollbar-thumb {
	background: rgb(0 0 0 / 40%);
	border-radius: 3px;
}
</style>

<script setup lang="ts">

</script>

<template>
	<div :class="classes.content">
		<slot />
	</div>
</template>

<style module="classes">
.content {
	max-height: calc(80svh - 46px);
	margin: 0 -6px;
	padding: 0 12px 6px;
	overflow-y: auto;
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

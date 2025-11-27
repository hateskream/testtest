<script setup lang="ts">

</script>

<template>
	<div :class="classes.content">
		<slot	/>
	</div>
</template>

<style module="classes">
.content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	min-width: 230px;
	max-width: 360px;
	max-height: calc(500px - 40px);
	padding:
		var(--padding-padding-s5, 8px)
		var(--padding-padding-s9, 16px)
		var(--padding-padding-s13, 28px)
		var(--padding-padding-s9, 16px);
	overflow-y: auto;
	scrollbar-gutter: stable;
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

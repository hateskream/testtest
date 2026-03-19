<script setup lang="ts">

</script>

<template>
	<div :class="classes.scroll">
		<slot></slot>
	</div>
</template>

<style module="classes">
.scroll {
	display: inline-flex;
	flex: 1;
	flex-direction: column;
	align-items: center;
	width: 100%;
	min-height: 0;
	padding: var(--padding-padding-s0, 0) 0 var(--stack-gap-none, 0) 0;
	padding-top: 12px;
	overflow-y: scroll;
	gap: 20px;
	mask-image:
		linear-gradient(
			to bottom,
			transparent 0%,
			#000000 12px,
			#000000 calc(100% - 12px),
			transparent 100%
		);
}
</style>

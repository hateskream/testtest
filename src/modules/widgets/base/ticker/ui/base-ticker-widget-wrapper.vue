<script setup lang="ts">
</script>

<template>
	<div :class="classes.widget">
		<slot />
	</div>
</template>

<style module="classes">
.widget {
	overflow: hidden;
	background: var(--surface-01, rgb(17 17 19 / 92%));
	border: 1px solid var(--atom-base-90, rgb(73 73 80 / 15%));
	border-radius: 18px;
}
</style>

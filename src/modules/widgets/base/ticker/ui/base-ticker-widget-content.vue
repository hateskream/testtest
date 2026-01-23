<script setup lang="ts">

</script>

<template>
	<div :class="classes.content">
		<slot />
	</div>
</template>

<style module="classes">
.content {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	align-self: stretch;
	padding: var(--padding-padding-s5, 8px) var(--padding-padding-s0, 0);
}
</style>

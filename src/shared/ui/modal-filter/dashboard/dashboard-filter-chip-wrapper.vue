<script setup lang="ts">

</script>

<template>
	<div :class="classes.wrapper">
		<slot />
	</div>
</template>

<style module="classes">
.wrapper {
	display: flex;
	flex: 1 0 0;
	flex-wrap: wrap;
	align-content: center;
	align-items: center;
	padding: var(--padding-padding-s3, 4px) 0;
	gap: 4px var(--padding-padding-s3, 4px);
}
</style>

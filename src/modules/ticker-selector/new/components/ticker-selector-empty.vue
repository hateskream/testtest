<script setup lang="ts">

</script>

<template>
	<div :class="classes.empty" class="text-200-r">
		<slot />
	</div>
</template>

<style module="classes">
.empty {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	min-height: 100px;
	text-align: center;
	color: var(--text-color-base-300);
}
</style>

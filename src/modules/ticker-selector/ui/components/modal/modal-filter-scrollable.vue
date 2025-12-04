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
}
</style>

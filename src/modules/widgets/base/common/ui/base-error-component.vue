<script setup lang="ts">
import ErrorNetworkComponent from './error-network-component.vue';

const emits = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<div :class="classes.root">
		<error-network-component @retry="emits('retry')" />
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}
</style>

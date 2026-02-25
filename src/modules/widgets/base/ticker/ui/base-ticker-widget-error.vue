<script setup lang="ts">
import { ErrorNetworkComponent } from '../../common';

const emit = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<div :class="classes.container">
		<error-network-component @retry="emit('retry')" />
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-items: center;
	align-self: stretch;
	width: 100%;
	padding: var(--padding-s11, 20px) 0;
}
</style>

<script setup lang="ts">
import { ErrorNetworkComponent } from '@/modules/widgets/base';

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
	flex-grow: 1;
	flex-direction: column;
	justify-content: center;
	margin: 8px 0;
	overflow: hidden;
	border: 1px solid #1d1d1e;
	border-radius: 18px;
}

@media (max-width: 768px) {
	.container {
		border-radius: 34px;
	}
}
</style>

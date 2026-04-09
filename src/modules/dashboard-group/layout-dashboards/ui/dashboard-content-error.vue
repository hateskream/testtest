<script setup lang="ts">
import { ErrorNetworkComponent } from '@/modules/widgets/base';

const emit = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<div :class="classes.content">
		<error-network-component @retry="emit('retry')" />
	</div>
</template>

<style module="classes">
.content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: center;
	padding: 8px 18px;
}
</style>

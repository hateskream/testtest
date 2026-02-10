<script setup lang="ts">
import { ErrorNetworkComponent } from '@/modules/widgets/base';

interface IEmits {
	retry: [];
}

const emit = defineEmits<IEmits>();
</script>

<template>
	<div :class="classes.errorContainer">
		<error-network-component @retry="emit('retry')" />
	</div>
</template>

<style module="classes">
.errorContainer {
	display: flex;
	justify-content: center;
	height: 100%;
	padding: var(--padding-s11, 20px) 0;
	background-color: var(--surface-01, rgb(17 17 19 / 92%));
	border: 1px solid var(--base-90, rgb(73 73 80 / 12%));
	border-radius: var(--radius-s14-32, 12.4px);
}
</style>

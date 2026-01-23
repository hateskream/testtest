<script setup lang="ts">
import { ErrorNetworkComponent } from '@/modules/widgets/base';

const emits = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<div :class="classes.container">
		<error-network-component @retry="emits('retry')" />
	</div>
</template>

<style module="classes">
.container {
	display: grid;
	width: 100%;
	height: 120px;
	place-items: center;
}
</style>

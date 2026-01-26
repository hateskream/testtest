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
	display: grid;
	width: 100%;
	height: 120px;
	place-items: center;
}
</style>

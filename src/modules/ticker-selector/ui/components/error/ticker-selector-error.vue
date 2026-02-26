<script setup lang="ts">
import { ErrorNetworkComponent } from '@/modules/widgets/base';

const emits = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<div :class="classes.skeleton">
		<error-network-component @retry="emits('retry')" />
	</div>
</template>

<style module="classes">
.skeleton {
	display: grid;
	place-items: center;
	width: 100%;
	height: 300px;
}
</style>

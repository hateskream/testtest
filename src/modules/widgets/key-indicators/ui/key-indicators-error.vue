<script setup lang="ts">
import { BaseErrorComponent } from '../../base';

const emits = defineEmits<{
	retry: [];
}>();
</script>

<template>
	<div :class="classes.container">
		<base-error-component @retry="emits('retry')" />
	</div>
</template>

<style module="classes">
.container {
	display: grid;
	width: 100%;
	height: 144px;
	place-items: center;
}
</style>

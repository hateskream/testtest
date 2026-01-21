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
	width: 100%;
	height: 144px;
	display: grid;
	place-items: center;
}
</style>

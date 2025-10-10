<script setup lang="ts">
import { BaseSwitch } from '../..';
import { ModalItem } from '../index';

const model = defineModel<boolean>({
	required: true,
});
</script>

<template>
	<modal-item
		:class="classes.content"
		@click="model = !model"
	>
		<slot name="default" />

		<base-switch :is-active="model" />
	</modal-item>
</template>

<style module="classes">
.content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
}
</style>

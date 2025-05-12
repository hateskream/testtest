<script setup lang="ts">
import { BaseSwitch } from '../..';
import { ModalItem } from '../index';

interface IProps {
	modelValue: boolean;
}

interface IEmits {
	(e: 'update:modelValue', data: boolean): void;
}

const props = defineProps<IProps>();

const emits = defineEmits<IEmits>();
</script>

<template>
	<modal-item
		:class="classes.content"
		@click="emits('update:modelValue', !modelValue)"
	>
		<slot name="default" />

		<base-switch :is-active="props.modelValue" />
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

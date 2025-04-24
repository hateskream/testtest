<script setup lang="ts">
import { RcmItem } from '../index';
import { BaseSwitch } from '../../base';

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
	<rcm-item
		:class="classes.content"
		@click="emits('update:modelValue', !modelValue)"
	>
		<slot name="default" />

		<base-switch :is-active="props.modelValue" />
	</rcm-item>
</template>

<style module="classes">
.content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
}
</style>

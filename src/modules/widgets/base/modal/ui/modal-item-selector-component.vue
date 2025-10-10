<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { ModalItem } from '../index';

interface IProps {
	modelValue: boolean;
}

interface IEmits {
	(e: 'update:modelValue', data: boolean): void;
}

const props = defineProps<IProps>();

const emits = defineEmits<IEmits>();

const classes = useCssModule('classes');

const classesList = computed(() => ({
	[classes.icon]: true,
	[classes.iconActive]: props.modelValue,
}));
</script>

<template>
	<modal-item
		:class="classes.content"
		@click="emits('update:modelValue', !modelValue)"
	>
		<slot name="default" />

		<div :class="classesList" />
	</modal-item>
</template>

<style module="classes">
.icon {
	width: 20px;
	height: 20px;
	color: var(--icon-color-base-500);
	border-style: solid;
	border-color: var(--bg-modal-color-base);
	border-radius: 100px;
}

.content:hover .icon {
	border-width: 1px;
	border-color: rgb(245 245 245 / 90%);
}

.iconActive {
	box-sizing: border-box;
	border-width: 6px !important;
	border-color: rgb(245 245 245 / 90%);
}

.content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
	user-select: none;
}
</style>

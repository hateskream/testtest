<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import ModalItemComponent from './modal-item-component.vue';


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
	<modal-item-component
		:class="classes.content"
		@click="emits('update:modelValue', !modelValue)"
	>
		<slot name="default" />

		<div :class="classesList" />
	</modal-item-component>
</template>

<style module="classes">
.icon {
	flex-shrink: 0;
	width: 20px;
	height: 20px;
	color: var(--icon-color-base-500);
	border-width: 1px;
	border-style: solid;
	border-color: var(--bg-modal-color-base);
	border-radius: 100px;
}

.content:hover .icon {
	border-width: 1px;
	border-color: var(--border-color-base-500);
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

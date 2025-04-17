<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { RcmItem } from '../index';

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
	[classes.switchWrapper]: true,
	[classes.switchActive]: props.modelValue,
}));
</script>

<template>
	<rcm-item
		:class="classes.content"
		@click="emits('update:modelValue', !modelValue)"
	>
		<slot name="default" />

		<div :class="classesList" />
	</rcm-item>
</template>

<style module="classes">
.switchWrapper {
	position: relative;
	width: 34px;
	height: 19px;
	background: #262626;
	border: none;
	border-radius: 16px;
}

.switchWrapper::after {
	content: '';
	position: absolute;
	top: 2px;
	left: 2px;
	width: 15px;
	height: 15px;
	background-color: rgb(255 255 255 / 40%);
	border-radius: 100%;
	transition: transform 0.3s ease;
}

.switchActive::after {
	background-color: rgb(255 255 255);
	transform: translateX(100%);
}

.content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
}
</style>

<script setup lang="ts">
import { defineProps, defineEmits, computed, useCssModule } from 'vue';

interface IToggleComponentProps {
	label: string;
	checked: boolean;
}

const props = defineProps<IToggleComponentProps>();

const emit = defineEmits<{
	(event: 'update:checked', value: boolean): void;
}>();

const classes = useCssModule('classes');

const classList = computed(() => ({
	[classes.active]: props.checked,
}));
</script>

<template>
	<div
		:class="classes.toggle"
		@click="emit('update:checked', !props.checked)"
	>
		<span :class="classes.label">{{ props.label }}</span>
		<div :class="[classes.switch, classList]">
			<div :class="[classes.thumb, classList]" />
		</div>
	</div>
</template>

<style module="classes">
.toggle {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	color: #ffffff;
	cursor: pointer;
}

.label {
	font-weight: 400;
	font-size: 14px;
}

.switch {
	position: relative;
	display: flex;
	align-items: center;
	width: 34px;
	height: 20px;
	background-color: rgb(38 38 38 / 100%);
	border-radius: 10px;
	transition: background-color 0.3s;
}

.switch.active {
	background-color: rgb(61 61 61 / 80%);
}

.thumb {
	position: absolute;
	top: 50%;
	left: 2.5px;
	width: 15px;
	height: 15px;
	background-color: rgb(255 255 255 / 40%);
	border-radius: 50%;
	transform: translateY(-50%);
	transition: left 0.3s ease;
}

.switch.active .thumb {
	left: calc(100% - 17.5px);
	background-color: rgb(255 255 255 / 100%);
}
</style>

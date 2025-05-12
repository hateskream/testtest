<script setup lang="ts">
import { computed, useCssModule } from 'vue';

interface IProps {
	isActive: boolean;
}

const props = defineProps<IProps>();

const classes = useCssModule('classes');

const classesList = computed(() => ({
	[classes.switchWrapper]: true,
	[classes.switchActive]: props.isActive,
}));
</script>

<template>
	<div :class="classesList" />
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
</style>

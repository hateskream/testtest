<script setup lang="ts">
import { RcmItem } from '../index';

interface IProps {
	value: string | number;
}

defineProps<IProps>();
</script>

<template>
	<rcm-item :class="classes.content">
		<slot name="default" />

		<span :class="classes.number">{{ value }}</span>
	</rcm-item>
</template>

<style module="classes">
.content {
	display: flex;
	justify-content: space-between;
	align-items: center;
	cursor: pointer;
}

.number {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	font-weight: 300;
	font-size: 12px;
	color: var(--text-color-base-300);
	background-color: var(--bg-color-base-300);
	border-radius: 6px;
}
</style>

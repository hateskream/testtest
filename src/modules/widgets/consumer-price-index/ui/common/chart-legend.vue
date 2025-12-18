<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

interface IChartLegend {
	items: {
		label: string;
		color: string;
	}[];
}

const props = defineProps<IChartLegend>();
</script>

<template>
	<div :class="classes.container">
		<div
			v-for="(item, index) in props.items"
			:key="index"
			:class="classes.item"
		>
			<span :class="classes.dot" :style="{ backgroundColor: item.color }"></span>
			<ui-text token="text-100-r">{{ item.label }}</ui-text>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	align-items: center;
	gap: 32px;
}

.item {
	display: flex;
	align-items: center;
	font-style: normal;
	color: var(--text-300, rgb(255 255 255 / 62%));
	gap: 4px;
}

.dot {
	width: 6px;
	height: 6px;
	border-radius: 50%;
}
</style>

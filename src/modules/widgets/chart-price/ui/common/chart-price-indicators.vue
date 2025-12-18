<script setup lang="ts">
import { UiText } from '@/shared/ui/text';

interface IChartPriceIndicatorsProps {
	indicators: {
		title: string;
		color: string;
	}[];
}

const props = defineProps<IChartPriceIndicatorsProps>();
</script>

<template>
	<div :class="classes.container">
		<div v-for="indicator in props.indicators" :class="classes.indicator">
			<div :class="classes.circle" :style="{ backgroundColor: indicator.color }"></div>
			<ui-text token="text-100-r">{{ indicator.title }}</ui-text>
		</div>
		<div :class="classes.indicator">
			<ui-text token="text-100-r">Market</ui-text>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.indicator {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 18px;
	padding: 0 var(--tile-padding-md-out, 6px);
	background-color: var(--bg-300, rgb(73 73 80 / 52%));
	border-radius: 16px;
	gap: 4px;
}

.circle {
	width: 4px;
	height: 4px;
	border-radius: 50%;
}
</style>

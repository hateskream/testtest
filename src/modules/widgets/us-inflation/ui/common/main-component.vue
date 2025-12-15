<script setup lang="ts">
import { computed } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { IUSInflationDomain } from '../../model';
import { UiText } from '@/shared/ui/text';

import ChartComponent from './chart-component.vue';

interface IMainComponentProps {
	data: IUSInflationDomain;
}

const props = defineProps<IMainComponentProps>();

const isUpTrend = computed(() => props.data.yoy_change.direction === 'up');

const trendLabel = computed(() => {
	return isUpTrend.value ? 'growth' : 'down';
});
</script>

<template>
	<div :class="classes.container">
		<div :class="classes.textContainer">
			<div :class="classes.title">
				<img
					:class="classes.flag"
					src="https://flagcdn.com/us.svg"
					alt="US flag"
				/>
				<ui-text token="title-200">{{ props.data.current_value }}%</ui-text>
			</div>
			<div :class="classes.text">
				<ui-text token="text-200-r">
					Inflation {{ trendLabel }} YoY:
				</ui-text>
			</div>
			<div :class="[classes.text, classes.trend]">
				<ui-text token="text-200-r">
					{{ props.data.yoy_change.value }} pp
				</ui-text>
				<ui-icon
					:id="isUpTrend ? IconIds.Gainers : IconIds.Loosers"
					height="6px"
					width="6px"
				/>
			</div>
		</div>
		<div :class="classes.chart">
			<chart-component :points="props.data.chart" />
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-grow: 1;
	gap: 12px;
	padding: 12px 0 20px 20px;
}

.textContainer {
	display: flex;
	flex-direction: column;
}

.title {
	display: flex;
	align-items: center;
	color: rgb(255 255 255 / 96%);
	gap: 6px;
}

.flag {
	width: 20px;
	height: 20px;
	border-radius: 50%;
	object-fit: cover;
	object-position: 25%;
}

.text {
	color: rgb(255 255 255 / 62%);
}

.trend {
	display: inline-flex;
	align-items: center;
	gap: var(--padding-padding-s4, 6px);
}

.chart {
	flex-grow: 1;
	height: 100%;
}
</style>

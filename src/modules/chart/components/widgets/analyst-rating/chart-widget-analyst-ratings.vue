<script setup lang="ts">
import { computed } from 'vue';

import { ChartCommonWidgetLayout } from '../../shared/ui';

import AnalystRatingsRadarChart from './analyst-ratings-radar-chart.vue';

export interface IAnalystRatingData {
	strongBuy: number;
	buy: number;
	neutral: number;
	sell: number;
	strongSell: number;
}

export interface IAnalystRatingsWidgetProps {
	data?: IAnalystRatingData;
	summary?: 'Optimistic' | 'Neutral' | 'Pessimistic';
}

const props = withDefaults(defineProps<IAnalystRatingsWidgetProps>(), {
	data: () => ({
		strongBuy: 7,
		buy: 5,
		neutral: 10,
		sell: 1,
		strongSell: 0,
	}),
	summary: 'Optimistic',
});

const colorByStatus = computed(() => {
	return props.summary === 'Optimistic' ?
		'#04eda0' :
		props.summary === 'Neutral' ?
			'var(--text-color-base-500)' :
			'var(--text-color-negative-500)';
});
</script>

<template>
	<chart-common-widget-layout>
		<template #header>
			<div :class="classes.header">
				Analyst Ratings
				<div
					:class="classes.summary"
					:style="{color: colorByStatus}"
				>
					{{ props.summary }}
				</div>
			</div>
		</template>
		<template #body>
			<analyst-ratings-radar-chart :data="props.data" />
		</template>
	</chart-common-widget-layout>
</template>

<style module="classes">
.header {
	display: inline-flex;
	justify-content: space-between;
	width: 100%;
}

.summary {
	display: flex;
	align-items: center;
	padding: 1px 5px;
	font-size: 12px;
	line-height: normal;
	color: #999999;
	background: rgb(31 31 31 / 70%);
	border-radius: 4px;
}
</style>

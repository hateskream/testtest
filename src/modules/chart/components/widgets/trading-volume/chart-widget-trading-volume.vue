<script setup lang="ts">
import { computed } from 'vue';

import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { BarChartFilled } from '@/modules/bar-chart';
import type { IBarChartModel } from '@/modules/bar-chart/bar-chart.model';

// TODO: move to models
export interface ITradingVolumeProps {
	widgetData: {
		title: string;
		summary: string;
		ticker: string;
		status: 'negative' | 'positive' | 'neutral';
	};
	charts: IChartData[];
}

interface IChartData extends IBarChartModel {
	period: string;
	value: string;
}


const props = defineProps<ITradingVolumeProps>();


const summaryColor = computed(() => {
	return props.widgetData.status === 'negative' ?
		'var(--text-color-negative-500)' : 'var(--text-color-positive-500)';
});

const colorByChartData = (chart: IChartData) => {
	return chart.currentValue < 0 ?
		'var(--text-color-negative-500)' : 'var(--text-color-positive-500)';
};
</script>


<template>
	<chart-common-widget-layout :class="classes.priceEarningsWidget">
		<template #header>
			<div :class="classes.headLine">
				{{ props.widgetData.title }}
				<div
					:class="classes.summary"
					:style="{color: summaryColor}"
				>
					{{ props.widgetData.summary }}
				</div>
			</div>
		</template>
		<template #body>
			<div :class="classes.chartTable">
				<div
					v-for="chart in props.charts"
					:key="chart.period"
					:class="classes.tradingVolumeBarChartWrapper"
				>
					<div :class="classes.tradingVolumeBarChartTitle">
						<span :class="classes.period">{{ chart.period }}</span>
						<span :class="classes.value" :style="{color: colorByChartData(chart)}">
							{{ chart.value }}
						</span>
					</div>
					<bar-chart-filled v-bind="chart" />
				</div>
			</div>
		</template>
	</chart-common-widget-layout>
</template>


<style module="classes">
.priceEarningsWidget {
	display: flex;
	align-self: stretch;
}

.headLine {
	display: inline-flex;
	justify-content: space-between;
	width: 100%;
}

.summary {
	display: flex;
	align-items: center;
	padding: 1px 4px;
	font-size: 12px;
	line-height: normal;
	color: #999999;
	background: rgb(31 31 31 / 70%);
	border-radius: 4px;
}

.chartTable {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	gap: 24px;
}

.tradingVolumeBarChartWrapper {
	display: flex;
	flex-direction: column;
	align-self: stretch;
	gap: 8px;
}

.tradingVolumeBarChartTitle {
	padding-inline: 2px;
	display: flex;
	justify-content: space-between;
	align-items: center;

	.period {
		font-weight: 440;
		font-size: var(--typography-paragraph-size-p-01, 12px);
		color: var(--color-text-base-500, #ffffff);
		letter-spacing: 0.096px;
	}

	.value {
		font-size: 12px;
	}
}
</style>

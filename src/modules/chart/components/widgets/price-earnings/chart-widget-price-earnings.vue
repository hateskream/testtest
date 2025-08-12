<script setup lang="ts">
import { computed } from 'vue';

import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import type { IBarChartModel } from '@/modules/bar-chart/bar-chart.model';
import { SparklineBarChart } from '@/modules/bar-chart';

// TODO: remove defaults and make all props required
interface IPriceEarningsProps {
	widgetData?: {
		title: string;
		summary: string;
		ticker: string;
		status: 'negative' | 'positive' | 'neutral';
	};
	tickerChart?: IChartData;
	pncChart?: IChartData;
	cChart?: IChartData;
	msChart?: IChartData;
}

interface IChartData extends IBarChartModel {
	title: string;
}

const props = withDefaults(defineProps<IPriceEarningsProps>(), {
	widgetData: () => ({
		title: 'P/E',
		summary: '51% above sector average',
		status: 'negative',
		ticker: 'TSLA',
	}),
	tickerChart: () => ({
		title: 'TSLA',
		minValue: 0,
		maxValue: 30,
		currentValue: 12.9,
		compact: true,
	}),
	pncChart: () => ({
		title: 'PNC',
		minValue: 0,
		maxValue: 30,
		currentValue: 11.7,
		compact: true,
	}),
	cChart: () => ({
		title: 'C',
		minValue: 0,
		maxValue: 30,
		currentValue: 10.7,
		compact: true,
	}),
	msChart: () => ({
		title: 'MS',
		minValue: 0,
		maxValue: 30,
		currentValue: 14.3,
		compact: true,
	}),
});


const colorByStatus = computed(() => {
	return props.widgetData.status === 'negative' ?
		'var(--text-color-negative-500)' : 'var(--text-color-positive-500)';
});
</script>


<template>
	<chart-common-widget-layout :class="classes.priceEarningsWidget">
		<template #header>
			<div :class="classes.headLine">
				{{ props.widgetData.title }}
				<div
					:class="classes.summary"
					:style="{color: colorByStatus}"
				>
					{{ props.widgetData.summary }}
				</div>
			</div>
		</template>
		<template #body>
			<div :class="classes.chartTable">
				<div :class="classes.startColumn">
					<span>{{ props.tickerChart.title }}</span>
					<span>{{ props.pncChart.title }}</span>
					<span>{{ props.cChart.title }}</span>
					<span>{{ props.msChart.title }}</span>
				</div>

				<div :class="classes.chartColumn">
					<sparkline-bar-chart
						:class="classes.chart"
						:min-value="props.tickerChart.minValue"
						:max-value="props.tickerChart.maxValue"
						:current-value="props.tickerChart.currentValue"
						:bar-color="props.tickerChart.barColor"
						:compact="props.tickerChart.compact"
					/>

					<sparkline-bar-chart
						:class="classes.chart"
						:min-value="props.pncChart.minValue"
						:max-value="props.pncChart.maxValue"
						:current-value="props.pncChart.currentValue"
						:bar-color="props.pncChart.barColor"
						:compact="props.pncChart.compact"
					/>

					<sparkline-bar-chart
						:class="classes.chart"
						:min-value="props.cChart.minValue"
						:max-value="props.cChart.maxValue"
						:current-value="props.cChart.currentValue"
						:bar-color="props.cChart.barColor"
						:compact="props.cChart.compact"
					/>

					<sparkline-bar-chart
						:class="classes.chart"
						:min-value="props.msChart.minValue"
						:max-value="props.msChart.maxValue"
						:current-value="props.msChart.currentValue"
						:bar-color="props.msChart.barColor"
						:compact="props.msChart.compact"
					/>
				</div>

				<div :class="classes.endColumn">
					<span>{{ props.tickerChart.currentValue }}</span>
					<span>{{ props.pncChart.currentValue }}</span>
					<span>{{ props.cChart.currentValue }}</span>
					<span>{{ props.msChart.currentValue }}</span>
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
	padding: 1px 5px;
	font-size: 12px;
	line-height: normal;
	color: #999999;
	background: rgb(31 31 31 / 70%);
	border-radius: 4px;
}

.chartTable {
	display: flex;
	flex-grow: 1;
	justify-content: space-between;
	align-items: center;
}

.startColumn,
.chartColumn,
.endColumn {
	display: flex;
	flex-direction: column;
	gap: 24px;
}

.startColumn > span:nth-child(n+2),
.chartColumn > span:nth-child(n+2),
.endColumn > span:nth-child(n+2) {
	color: var(--color-text-base-300, #9a9a9d);
}


.chartColumn {
	flex-grow: 1;
	align-self: stretch;
}

.chart {
	padding: 0 16px;
}

</style>

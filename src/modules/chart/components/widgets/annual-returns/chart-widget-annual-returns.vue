<script setup lang="ts">
import { computed } from 'vue';

import { ChartCommonWidgetLayout } from '@/modules/chart/components/shared/ui';
import { LineChartFilled } from '@/modules/bar-chart';
import type { ILineChartModel } from '@/modules/bar-chart/line-chart.model';

// TODO: move to models
export interface IAnnualReturnsProps {
	widgetData: {
		title: string;
		summary: string;
		ticker: string;
		status: 'negative' | 'positive' | 'neutral';
	};
	charts: IChartData[];
}

interface IChartData extends ILineChartModel {
	label: string;
}


const props = defineProps<IAnnualReturnsProps>();


const summaryColor = computed(() => {
	return props.widgetData.status === 'negative' ?
		'var(--text-color-negative-500)' : 'var(--text-color-positive-500)';
});
</script>


<template>
	<chart-common-widget-layout :class="classes.annualReturnsWidget">
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
			<div :class="classes.chartsContainer">
				<div
					v-for="chart in props.charts"
					:key="chart.label"
					:class="classes.chartWrapper"
				>
					<div :class="classes.chartTitle">
						<span :class="classes.label">{{ chart.label }}</span>
						<span :class="classes.value">{{ chart.value }}%</span>
					</div>
					<line-chart-filled v-bind="chart" />
				</div>
			</div>
		</template>
	</chart-common-widget-layout>
</template>


<style module="classes">
.annualReturnsWidget {
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

.chartsContainer {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	align-self: stretch;
	gap: 24px;
}

.chartWrapper {
	display: flex;
	flex-direction: column;
	align-self: stretch;
	gap: 8px;
}

.chartWrapper:first-child .chartTitle {
	color: var(--color-text-base-500, #ffffff);
}

.chartTitle {
	display: flex;
	justify-content: space-between;
	align-items: center;
	color: var(--color-text-base-300, #9a9a9d);

	.label {
		font-weight: 440;
		font-size: var(--typography-paragraph-size-p-01, 12px);
		letter-spacing: 0.096px;
	}

	.value {
		font-size: 12px;
	}
}
</style>

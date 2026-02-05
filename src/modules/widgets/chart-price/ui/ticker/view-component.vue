<script setup lang="ts">
import type { ChartType } from '@shared/component-library';
import { computed, useTemplateRef } from 'vue';

import {
	type DateRangeValue,
	DEFAULT_PRESETS,
	strTimeToChartTime,
	type TimezoneUtcType,
} from '@/modules/lightweight-charts/model';
import { ChartDateRange, ChartDateRangeChange, ChartNavigator } from '@/modules/lightweight-charts';
import type { ChartPriceHistoryData, PriceChanges } from '../../model';

import ChartComponent from './chart-component.vue';
import HeaderComponent from './header-component.vue';

export interface IChartPriceTickerViewProps {
	data: ChartPriceHistoryData;
	overview: ChartPriceHistoryData;
	changes?: PriceChanges;
	handleScale?: boolean;
	handleScroll?: boolean;
}

const props = defineProps<IChartPriceTickerViewProps>();

const emit = defineEmits<{
	downloadSnapshot: [canvas: HTMLCanvasElement];
}>();

const dateRange = defineModel<DateRangeValue>('dateRange', { required: true });
const timezone = defineModel<TimezoneUtcType>('timezone', { required: true });
const chartType = defineModel<ChartType>('chartType', { required: true });
const fullView = defineModel<boolean>('fullView', { default: false });

const preparedOverviewPoints = computed(() => {
	return props.overview.points.map(point => ({
		time: strTimeToChartTime(point.timestamp),
		value: point.priceCandle.close,
	}));
});

const chartRef = useTemplateRef('chart');

function downloadChartSnapshot() {
	if (!chartRef.value) {
		return;
	}

	const canvas = chartRef.value.takeScreenshot();

	if (canvas) {
		emit('downloadSnapshot', canvas);
	}
}
</script>

<template>
	<div ref="container" :class="classes.container">
		<div :class="classes.headerWrapper">
			<div v-if="fullView">
				[Ticker Selector]
			</div>
			<header-component
				v-model:date-range="dateRange"
				v-model:chart-type="chartType"
				v-model:timezone="timezone"
				v-model:full-view="fullView"
				:class="classes.header"
				@download-snapshot="downloadChartSnapshot"
			/>
		</div>
		<chart-component
			ref="chart"
			v-model:date-range="dateRange"
			:class="classes.chart"
			:points="props.data.points"
			:current="props.data.current"
			:handle-scale="props.handleScale"
			:handle-scroll="props.handleScroll"
			:date-range-presets="DEFAULT_PRESETS"
			:type="chartType"
			:timezone="timezone"
		/>
		<chart-date-range
			v-model="dateRange"
			:presets="DEFAULT_PRESETS"
			:class="classes.dateRange"
		>
			<template #preset="{ preset }">
				<span>{{ preset }}</span>
				<chart-date-range-change
					v-if="changes && changes[preset]"
					:value="changes[preset]"
					:trend="changes[preset] < 0 ? 'negative' : 'positive'"
					is-percent
				/>
			</template>
		</chart-date-range>
		<chart-navigator
			v-model="dateRange"
			:data="preparedOverviewPoints"
			:class="classes.navigator"
		/>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
	align-self: stretch;
	height: 100%;
	min-height: 0;
	max-height: 100%;
	padding: var(--padding-s9, 16px) 0;
	gap: var(--padding-s5, 8px);
}

.headerWrapper {
	display: flex;
	align-items: center;
	width: 100%;
	gap: 20px;
}

.header {
	flex: 1 1 0;
}

.chart {
	gap: var(--padding-s1, 1px);
	flex: 1 0 0;
	min-height: 0;
}

.dateRange {
	flex-shrink: 0;
	width: 100%;
}

.navigator {
	flex-shrink: 0;
}
</style>

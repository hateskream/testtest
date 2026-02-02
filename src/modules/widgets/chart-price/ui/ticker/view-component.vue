<script setup lang="ts">
import type { ChartType } from '@shared/component-library';

import {
	DateRangePreset,
	type DateRangeValue,
	DEFAULT_PRESETS,
	type TimezoneUtcType,
} from '@/modules/lightweight-charts/model';
import { ChartDateRange, ChartDateRangeChange } from '@/modules/lightweight-charts';
import type { ChartPriceHistoryData } from '../../model';

import ChartComponent from './chart-component.vue';
import FiltersComponent from './filters-component.vue';

export interface IChartPriceTickerViewProps {
	data: ChartPriceHistoryData;
	handleScale?: boolean;
}

const props = defineProps<IChartPriceTickerViewProps>();

const dateRange = defineModel<DateRangeValue>('dateRange', { required: true });
const timezone = defineModel<TimezoneUtcType>('timezone', { required: true });
const chartType = defineModel<ChartType>('chartType', { required: true });

// TODO: Вынести в пропсы
const changes = {
	[DateRangePreset.Day]: -0.33,
	[DateRangePreset.Week]: -1.43,
	[DateRangePreset.Month]: -2.19,
	[DateRangePreset.SixMonths]: 9.44,
	[DateRangePreset.Year]: -12.88,
	[DateRangePreset.All]: 92.33,
} as const;
</script>

<template>
	<div :class="classes.container">
		<filters-component
			v-model:date-range="dateRange"
			v-model:chart-type="chartType"
			v-model:timezone="timezone"
		/>
		<chart-component
			v-model:date-range="dateRange"
			:class="classes.chart"
			:points="props.data.points"
			:current="props.data.current"
			:handle-scale="props.handleScale"
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
					v-if="changes[preset]"
					:value="changes[preset]"
					:trend="changes[preset] < 0 ? 'negative' : 'positive'"
					is-percent
				/>
			</template>
		</chart-date-range>
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
	padding: var(--padding-s9, 16px) 0;
	gap: var(--padding-s5, 8px);
}

.chart {
	gap: var(--padding-s1, 1px);
	flex: 1 0 0;
}

.dateRange {
	width: 100%;
}
</style>

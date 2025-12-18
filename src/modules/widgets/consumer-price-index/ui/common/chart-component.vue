<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import type { ChartOptions, TooltipOptions } from 'chart.js';

import type { BarDataset } from '@/modules/lightweight-charts';
import { ChartBar, ChartExternalTooltip } from '@/modules/lightweight-charts';
import { useAdaptiveBarPoints, useExternalTooltip } from '@/modules/lightweight-charts/composables';
import { CpiValueType, type ICpiHistoryPoint } from '../../model';
import { getDateFormatter } from '@/shared/lib';

const BAR_WIDTH = 15;

interface IChartComponentProps {
	points: ICpiHistoryPoint[];
	valueType: CpiValueType;
}

const props = defineProps<IChartComponentProps>();

const { points: filteredPoints } = useAdaptiveBarPoints(
	() => props.points,
	useTemplateRef('wrapper'),
	{ barWidth: BAR_WIDTH, minSpaceWidth: BAR_WIDTH * 2 },
);

const pointDateFormatter = getDateFormatter({ month: 'short' });

function parsePointDate(date: string) {
	if (/\d{4}-\d{2}/g.test(date)) {
		const [year, month] = date.split('-');

		const shortMonth = pointDateFormatter.format(new Date(2000, Number(month) - 1));

		return [shortMonth, year];
	}

	return date.split(' ');
}

const preparedLabels = computed(() => {
	if (!filteredPoints.value.length) {
		return [];
	}

	let [, lastYear] = parsePointDate(filteredPoints.value[0].label);

	return filteredPoints.value.map(point => {
		const [month, year] = parsePointDate(point.label);

		if (year !== lastYear) {
			lastYear = year;
			return year;
		}

		return month;
	});
});

const preparedData = computed(() => filteredPoints.value.map((point, index, all) => {
	const value = point.history;

	if (props.valueType === CpiValueType.Points) {
		return value;
	}

	if (index === 0) {
		return 0;
	}

	const prev = all[index - 1];

	if (props.valueType === CpiValueType.ChangeDelta) {
		return value - prev.history;
	}

	return (value - prev.history) / prev.history * 100;
}));

const preparedDatasets = computed((): [BarDataset] => {
	return [{
		data: preparedData.value,
		backgroundColor: 'rgba(255, 255, 255, 1)',
		borderColor: '#FFFFFF',
		borderRadius: 5,
		hoverBackgroundColor: 'rgba(255, 255, 255, 0.9)',
		hoverBorderColor: '#FFFFFF',
		barThickness: BAR_WIDTH,
		maxBarThickness: BAR_WIDTH,
		barPercentage: 1,
	}];
});

// tooltip

const { state, handler } = useExternalTooltip({
	mode: 'split',
	valueSuffix: '',
	valuePrefix: '',
});

const options = {
	interaction: {
		mode: 'index',
		intersect: false,
	},
	hover: { mode: 'dataset' },
	plugins: {
		legend: {
			display: false,
		},
		tooltip: {
			enabled: false,
			external: handler as unknown as TooltipOptions<'bar'>['external'],
		},
	},
} as const satisfies ChartOptions<'bar'>;
</script>

<template>
	<div ref="wrapper" :class="classes.wrapper">
		<chart-bar
			:datasets="preparedDatasets"
			:labels="preparedLabels"
			:options="options"
		/>
		<teleport to="body">
			<chart-external-tooltip v-bind="state" />
		</teleport>
	</div>
</template>

<style module="classes">
.wrapper {
	height: 100%;
}
</style>

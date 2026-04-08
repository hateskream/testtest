<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import type { ChartOptions, TooltipOptions } from 'chart.js';

import type { BarDataset } from '@/modules/charts/chart-js';
import { ChartBar, ChartExternalTooltip } from '@/modules/charts/chart-js';
import { useExternalTooltip } from '@/modules/charts/chart-js/composables';
import { useAdaptiveBarPoints } from '@/modules/charts/common/composables';
import { type RealGdpHistoryPoint, RealGdpValueType, type RealGdpValueTypeType } from '../../model';

const BAR_WIDTH = 15;

interface IChartComponentProps {
	points: RealGdpHistoryPoint[];
	valueType: RealGdpValueTypeType;
}

const props = defineProps<IChartComponentProps>();

const wrapper = useTemplateRef('wrapper');

const { points: filteredPoints } = useAdaptiveBarPoints(
	() => props.points,
	wrapper,
	{ barWidth: BAR_WIDTH, minSpaceWidth: BAR_WIDTH * 1.5 },
);

const preparedLabels = computed(() => filteredPoints.value.map(point => point.label));

const preparedData = computed(() => {
	return filteredPoints.value.map((point, index, all) => {
		const value = point.history;

		if (props.valueType === RealGdpValueType.Points) {
			return value;
		}

		if (index === 0) {
			return 0;
		}

		const prev = all[index - 1];

		if (props.valueType === RealGdpValueType.ChangeDelta) {
			return value - prev.history;
		}

		return (value - prev.history) / prev.history * 100;
	});
});

const preparedDatasets = computed((): [BarDataset] => {
	return [{
		data: preparedData.value,
		backgroundColor: 'rgba(255, 255, 255, 1)',
		borderColor: '#FFFFFF',
		borderRadius: 5,
		hoverBackgroundColor: 'rgba(255, 255, 255, 0.9)',
		hoverBorderColor: '#FFFFFF',
		barThickness: 15,
		maxBarThickness: 15,
		barPercentage: 1,
		label: 'GDP',
	}];
});

// tooltip

const { state, handler } = useExternalTooltip({
	mode: 'split',
	valueSuffix: '',
	valuePrefix: '',
	targetEl: wrapper,
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

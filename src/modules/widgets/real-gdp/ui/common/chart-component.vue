<script setup lang="ts">
import { computed } from 'vue';
import type { ChartOptions, TooltipOptions } from 'chart.js';

import type { BarDataset } from '@/modules/lightweight-charts';
import { ChartBar, ChartExternalTooltip } from '@/modules/lightweight-charts';
import { useExternalTooltip } from '@/modules/lightweight-charts/composables';
import type { IRealGdpHistoryPoint } from '../../model';

interface IChartComponentProps {
	points: IRealGdpHistoryPoint[];
}

const props = defineProps<IChartComponentProps>();

const preparedLabels = computed(() => props.points.map(point => point.label));
const preparedData = computed(() => props.points.map(point => point.history));

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
	<chart-bar
		:datasets="preparedDatasets"
		:labels="preparedLabels"
		:options="options"
	/>
	<teleport to="body">
		<chart-external-tooltip v-bind="state" />
	</teleport>
</template>

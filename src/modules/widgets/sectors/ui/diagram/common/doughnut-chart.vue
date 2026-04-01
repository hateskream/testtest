<script setup lang="ts">
import { computed, onMounted, onUnmounted, shallowRef, toRaw, useTemplateRef, watch } from 'vue';
import { Chart, type ChartDataset, type ChartOptions } from 'chart.js/auto';
import type { TooltipOptions } from 'chart.js';
import { notNullish } from '@vueuse/core';

import { useExternalTooltip } from '@/modules/charts/chart-js/composables';
import { ChartExternalTooltip } from '@/modules/charts/chart-js';
import {
	doughnutCenterTextPlugin,
	type DoughnutCenterTextPluginOptions,
	doughnutFloatingLabelsPlugin,
} from '@/modules/charts/chart-js/plugins';
import type { Sector } from '../../../model';
import DiagramPattern from '@/assets/images/diagram-pattern.png';

const SECTOR_BORDER_WIDTH = 1;
const SECTOR_BORDER_COLOR = 'rgba(13, 13, 14, 0.92)';

interface IDiagramChartProps {
	sectors: Sector[];
	label?: string;
}

const props = defineProps<IDiagramChartProps>();

const container = useTemplateRef('container');
const chart = shallowRef<Chart<'doughnut'> | null>(null);

const preparedDatasets = computed<ChartDataset<'doughnut'>[]>(() => {
	const subsectors = props.sectors.flatMap(sector => sector.subsectors).filter(notNullish) ;

	const colors = props.sectors.map(sector => sector.color);
	const subsectorsColors = subsectors.map(sector => sector.color);

	return [
		{
			data: props.sectors.map(sector => sector.value),
			labels: props.sectors.map(sector => sector.sectorDisplayName),
			backgroundColor: colors,
			color: colors,
			borderWidth: SECTOR_BORDER_WIDTH,
			borderColor: SECTOR_BORDER_COLOR,
			weight: 15,
		},
		{
			data: subsectors.map(sector => sector.value),
			labels: subsectors.map(sector => sector.subSectorDisplayName),
			backgroundColor: subsectorsColors,
			color: subsectorsColors,
			borderWidth: SECTOR_BORDER_WIDTH,
			borderColor: SECTOR_BORDER_COLOR,
			weight: 3,
		},
	];
});

function doughnutCenterTextPluginOptions(): Partial<DoughnutCenterTextPluginOptions> {
	return {
		image: DiagramPattern,
		text: props.label,
		color: '#fff',
	};
}

const { state, handler } = useExternalTooltip({
	mode: 'datapoint',
	valuePrefix: '',
	valueSuffix: '%',
});

const defaultOptions: ChartOptions<'doughnut'> = {
	maintainAspectRatio: false,
	normalized: true,
	responsive: true,
	layout: {
		padding: 7,
	},
	animation: false,
	plugins: {
		legend: { display: false },
		tooltip: {
			enabled: false,
			external: handler as unknown as TooltipOptions<'doughnut'>['external'],
		},
		doughnutCenterText: doughnutCenterTextPluginOptions(),
		doughnutFloatingLabels: {
			datasets: [0],
			label: (dataset, dataIndex) => `${dataset.data[dataIndex]}%`,
		},
	},
	scales: {
		y: {
			display: false,
		},
		x: {
			display: false,
		},
	},
};

function createChart(): void {
	if (!container.value) {
		return;
	}

	if (chart.value) {
		chart.value.destroy();
	}

	chart.value = new Chart(container.value, {
		type: 'doughnut',
		data: {
			datasets: toRaw(preparedDatasets.value),
		},
		plugins: [doughnutCenterTextPlugin, doughnutFloatingLabelsPlugin],
		options: defaultOptions,
	});
}

onMounted(createChart);

onUnmounted(() => {
	if (chart.value) {
		chart.value.destroy();
		chart.value = null;
	}
});

watch(preparedDatasets,
	() => {
		const instance = chart.value;

		if (!instance) {
			createChart();
			return;
		}

		instance.data.datasets = toRaw(preparedDatasets.value);

		if (instance.options.plugins?.doughnutCenterText) {
			instance.options.plugins.doughnutCenterText = doughnutCenterTextPluginOptions();
		}

		instance.update();
	},
);
</script>
<template>
	<div :class="classes.wrapper">
		<canvas ref="container" :class="classes.chart"></canvas>
		<teleport to="body">
			<chart-external-tooltip v-bind="state" width="max-content" />
		</teleport>
	</div>
</template>

<style module="classes">
.wrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
}

.chart {
	flex-grow: 1;
	width: 100%;
}
</style>

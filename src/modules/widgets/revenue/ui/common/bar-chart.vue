<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import type { ChartOptions, TooltipOptions } from 'chart.js';

import { type BarDataset, ChartBar, ChartExternalTooltip } from '@/modules/charts/chart-js';
import { useExternalTooltip } from '@/modules/charts/chart-js/composables';
import { formatPrice } from '@/modules/charts/common/lib';
import { getQuarterColor, type RevenueYearQuarterly } from '../../model';

const QUARTERS_COUNT = 4;

interface IBarChartProps {
	years: RevenueYearQuarterly[];
}

const props = defineProps<IBarChartProps>();

const preparedLabels = computed(() => props.years.map((year) => String(year.year)));

const preparedDatasets = computed((): BarDataset[] => {
	return Array.from({ length: QUARTERS_COUNT }, (_, quarterIdx) => {
		const data = props.years.map((year) => year.quarters[quarterIdx]?.value);
		const backgroundColor = props.years.map((year) => getQuarterColor(year.quarters[quarterIdx]));

		return {
			data,
			backgroundColor,
			borderColor: backgroundColor,
			borderWidth: 0,
			borderRadius: 5,
			barPercentage: .9,
			categoryPercentage: 0.9,
			label: `Q${quarterIdx + 1}`,
		};
	});
});

const wrapper = useTemplateRef('wrapper');

const { state, handler } = useExternalTooltip({
	mode: 'split',
	valueSuffix: '',
	valuePrefix: '',
	transformRowValue: value => formatPrice(Number(value.replaceAll(' ', ''))),
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
			begin-at-zero
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

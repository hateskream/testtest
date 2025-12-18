<script setup lang="ts">
import { CrosshairMode } from 'lightweight-charts';
import { computed } from 'vue';

import { RangeChart } from '@/shared/ui/chart-range';
import { Chart } from '@/modules/lightweight-charts';
import type { IUSInflationPoint } from '../../model';

interface IChartComponentProps {
	points: IUSInflationPoint[];
}

const props = defineProps<IChartComponentProps>();

const preparedDatasets = computed(() => {
	return props.points.map(point => ({ time: point.label, value: point.value }));
});
</script>

<template>
	<chart
		:range-list="Object.values(RangeChart)"
		:is-visible-history-graph="false"
		:is-visible-indicators="false"
		:is-visible-range="false"
		:is-visible-range-change="false"
		:is-visible-price-scale="false"
		:is-visible-time-scale="false"
		:is-padded-range="false"
		:is-show-tooltip="false"
		:crosshair-mode="CrosshairMode.Hidden"
		:is-visible-price-line="false"
		:width="100"
		:data="preparedDatasets"
		height="100%"
		disable-scroll
		color-schema="neutral"
		fade-left
	/>
</template>

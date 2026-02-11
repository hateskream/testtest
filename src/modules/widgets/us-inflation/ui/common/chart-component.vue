<script setup lang="ts">
import { CrosshairMode } from 'lightweight-charts';
import { computed } from 'vue';

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
		:is-visible-price-scale="false"
		:is-visible-time-scale="false"
		:is-show-tooltip="false"
		:crosshair-mode="CrosshairMode.Hidden"
		:is-visible-price-line="false"
		:data="preparedDatasets"
		height="100%"
		color-schema="neutral"
		fade-left
		auto-size
	/>
</template>

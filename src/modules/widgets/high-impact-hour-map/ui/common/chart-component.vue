<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';

import type { IHighImpactHourMapDomain } from '../../model';

import ChartBar from './chart-bar.vue';

const BAR_WIDTH = 15;
const MIN_BAR_GAP = 2;

const emit = defineEmits<{
	'click-on-bar': [hours: number[]];
}>();

interface IChartProps {
	data: IHighImpactHourMapDomain;
}

const props = defineProps<IChartProps>();

const { width: chartWidth } = useElementSize(useTemplateRef('chart'));

const availableBarCount = computed(() => Math.floor(chartWidth.value / (BAR_WIDTH + MIN_BAR_GAP)));

const hoursPerBar = computed(() => {
	if (availableBarCount.value === 0) {
		return 1;
	}

	return Math.max(1, Math.ceil(props.data.hours.length / availableBarCount.value));
});

const preparedBars = computed(() => {
	const segmentsCount = Math.ceil(props.data.hours.length / hoursPerBar.value);
	const segments = [];

	for (let i = 0; i < segmentsCount; i += 1) {
		const segment = {
			id: i,
			hours: [] as number[],
			impactLevel: 0,
			active: false,
			eventsCount: 0,
		};

		for (let j = 0; j < hoursPerBar.value; j += 1) {
			const key = i * hoursPerBar.value + j;

			segment.hours.push(props.data.hours[key].hour);
			segment.impactLevel += props.data.hours[key].impactLevel;
			segment.active = segment.active || props.data.hours[key].active;
			segment.eventsCount += props.data.hours[key].highEventsCount;
		}

		segments.push(segment);
	}

	return segments;
});
</script>

<template>
	<div ref="chart" :class="classes.chart">
		<chart-bar
			v-for="bar in preparedBars"
			:key="bar.id"
			:impact-level="bar.impactLevel"
			:hours="bar.hours"
			:active="bar.active"
			:events-count="bar.eventsCount"
			@click="emit('click-on-bar', bar.hours)"
		/>
	</div>
</template>

<style module="classes">
.chart {
	display: flex;
	flex-grow: 1;
	justify-content: space-between;
	gap: 4px;
}
</style>

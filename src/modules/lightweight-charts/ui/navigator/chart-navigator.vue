<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, shallowRef, useTemplateRef } from 'vue';
import {
	type AreaData,
	AreaSeries,
	createChart,
	CrosshairMode,
	type IChartApi,
	type ITimeScaleApi,
	type MouseEventParams,
	type Time,
} from 'lightweight-charts';
import type { LineData } from '@shared/component-library';

import {
	type DateRangeValue,
	secondsToUtcSeconds,
	timeToDate,
	timeToUtcSeconds,
	toUtcSecondsRange,
	type UtcSeconds,
} from '@/modules/lightweight-charts/model';

export interface IChartNavigatorProps {
	data: LineData[];
}

const props = defineProps<IChartNavigatorProps>();

const dateRange = defineModel<DateRangeValue>({ required: true });

const dateRangePresetValue = computed(() => toUtcSecondsRange(dateRange.value));

const fromIndex = computed(() => {
	if (props.data.length === 0) {
		return 0;
	}

	const fromValue = dateRangePresetValue.value.from;
	const lastPointTime = props.data[props.data.length - 1].time as UtcSeconds;

	if (lastPointTime <= fromValue) {
		return props.data.length - 1;
	}

	let index = 0;

	while ((props.data[index].time as UtcSeconds) < fromValue) {
		index++;
	}

	return index;
});

const toIndex = computed(() => {
	if (props.data.length === 0) {
		return 0;
	}

	const toValue = dateRangePresetValue.value.to;
	const firstPointTime = props.data[0].time as UtcSeconds;

	if (firstPointTime >= toValue) {
		return 0;
	}

	let index = props.data.length - 1;

	while ((props.data[index].time as UtcSeconds) > toValue) {
		index--;
	}

	return index;
});

const navigatorEl = useTemplateRef('navigator');

let chartInstance: IChartApi | null = null;
const timeScale = shallowRef<ITimeScaleApi<Time> | null>(null);

onMounted(initChart);

onBeforeUnmount(() => {
	timeScale.value = null;

	if (chartInstance) {
		chartInstance.remove();
		chartInstance = null;
	}
});

function initChart() {
	if (!navigatorEl.value) {
		return;
	}

	chartInstance = createChart(navigatorEl.value, {
		height: 80,
		layout: { background: { color: 'transparent' }, textColor: 'rgba(255, 255, 255, 0.50)' },
		rightPriceScale: { visible: false },
		timeScale: {
			visible: true, borderVisible: false,
			timeVisible: false,
			secondsVisible: false,
			tickMarkFormatter: (time: Time) => {
				return timeToDate(time).getFullYear().toString();
			},
			minBarSpacing: 0.1,
		},
		grid: { vertLines: { visible: false }, horzLines: { visible: false } },
		handleScroll: false,
		handleScale: false,
		crosshair: { mode: CrosshairMode.Hidden },
	});

	const miniSeries = chartInstance.addSeries(AreaSeries,
		{
			lineColor: 'rgba(255, 255, 255, 0.50)',
			topColor: 'rgba(73, 73, 80, 0.22)',
			bottomColor: 'rgba(73, 73, 80, 0.22)',
			priceLineVisible: false,
		},
	);

	miniSeries.setData(props.data as AreaData[]);

	timeScale.value = chartInstance.timeScale();
	timeScale.value.fitContent();

	chartInstance.subscribeClick(onNavigatorClick);
}

const selectionLeftInPercent = computed(() => {
	if (props.data.length === 0) {
		return '0%';
	}

	return `${fromIndex.value / props.data.length * 100}%`;
});
const selectionWidth = computed(() => {
	if (props.data.length === 0) {
		return '0%';
	}

	return `${(toIndex.value - fromIndex.value) / props.data.length * 100}%`;
});

function onNavigatorClick(params: MouseEventParams) {
	if (!params.time) {
		return;
	}

	const time = timeToUtcSeconds(params.time);
	const { from, to } = dateRangePresetValue.value;

	const span = to - from;
	const lastPointTime = props.data[props.data.length - 1].time as UtcSeconds;

	dateRange.value = {
		type: 'custom',
		from: secondsToUtcSeconds(Math.min(to - span, time)),
		to: secondsToUtcSeconds(Math.min(time + span, lastPointTime)),
	};
}
</script>

<template>
	<div :class="classes.navigator">
		<div ref="navigator" :class="classes.navigatorChart" />
		<div
			:class="classes.selection"
			:style="{ left: selectionLeftInPercent, width: selectionWidth }"
		>
			<div :class="[classes.handle, classes.left]">
				<div :class="classes.handleLine"></div>
			</div>
			<div :class="[classes.handle, classes.right]">
				<div :class="classes.handleLine"></div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.navigator {
	position: relative;
	flex-shrink: 0;
	width: 100%;
	min-width: 0;
	height: 80px;
}

.navigatorChart {
	flex-shrink: 0;
	width: 100%;
	min-width: 0;
	height: 80px;
}

.selection {
	position: absolute;
	top: 0;
	height: 52px;
	background: rgb(73 73 80 / 32%);
	cursor: grab;
}

.handle {
	position: absolute;
	top: 14px;
	z-index: 2;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	background-color: var(--bg-100, rgb(73 73 80 / 32%));
	border-radius: var(--radius-s12-24, 9.2px);
	backdrop-filter: blur(9px);
	aspect-ratio: 1/1;
}

.handle.left {
	left: 0;
	transform: translateX(calc(-50% - 1px));
}

.handle.right {
	right: 0;
	transform: translateX(calc(50% + 1px));
}

.handleLine {
	width: 2px;
	height: calc(100% - 10px);
	background-color: var(--icon-300, rgb(255 255 255 / 50%));
	border-radius: 5px;
}
</style>

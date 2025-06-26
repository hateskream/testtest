<script setup lang="ts">
import {
	ColorType,
	createChart,
	HistogramSeries,
	LastPriceAnimationMode,
	LineSeries,
	LineStyle,
	PriceScaleMode,
	type CandlestickData,
	type IChartApi,
} from 'lightweight-charts';
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import { addDays, addYears } from 'date-fns';

import { generateCandleDataFromLineData, generateLineData, groupSeriesByRange, prepareSeries } from '../utils';
import { RangeChart } from '../model';
import { RANGE_IN_SECONDS } from '../const';
import { TooltipPrimitive } from '../rectangles';

import ChartRange from '../components/chart-range.vue';

interface IChartProps {
	// width: number;
	height: number;
}

defineProps<IChartProps>();

const container = useTemplateRef('container');
const chart = ref<IChartApi | null>();

const mainData = ref(generateCandleDataFromLineData(generateLineData(500, 20)));

const graphA = ref();
const graphB = ref();


type IGroupedData = {
	[x in RangeChart]: CandlestickData[]
};

const currentRange = ref<RangeChart>(RangeChart['1Y']);

const groupedData = computed(() => {
	const group: IGroupedData = {} as IGroupedData;

	Object.entries(RangeChart).forEach(([key, val]) => {
		group[key as RangeChart] = groupSeriesByRange<CandlestickData>(mainData.value, RANGE_IN_SECONDS[val]);
	});

	return group;
});

function selectRange(range: RangeChart) {
	currentRange.value = range;


	const d = prepareSeries(groupedData.value[currentRange.value], 'Line');

	const nD = addYears(new Date(+d[d.length - 1].time * 1000), 1);

	graphA.value.setData(d.concat(
		[
			{
				time: nD.getTime() / 1000,
				value: d[d.length - 1].value * 2,
				color: 'rgba(255, 191, 0, 0.6)',
			},
		],
	));

	graphB.value.setData(prepareSeries(groupedData.value[currentRange.value], 'Line'));


	chart.value!.timeScale().fitContent();
}


onMounted(() => {
	chart.value = createChart(container.value as HTMLElement, {
		autoSize: true,
		layout: {
			textColor: '#9A9A9D',
			background: { type: ColorType.Solid, color: '#131315' },
		},
		handleScroll: {
			mouseWheel: false,
		},
		rightPriceScale: {
			mode: PriceScaleMode.Percentage,


			minimumWidth: 55,
			borderVisible: false,
		},
		leftPriceScale: {
			scaleMargins: {
				top: 0.1, // leave some space for the legend
				bottom: 0.2,
			},

			visible: true,

			mode: PriceScaleMode.Percentage,


			minimumWidth: 55,
			borderVisible: false,
		},
		// hide the grid lines
		grid: {
			vertLines: {
				visible: false,
			},
			horzLines: {
				visible: true,
				color: '#373737',
				style: LineStyle.Dashed,
			},
		},

		timeScale: {
			lockVisibleTimeRangeOnResize: true,

		},
	});


	chart.value!.timeScale().applyOptions({
		borderColor: 'rgba(4, 237, 160, 0.00)',
	});

	graphA.value = chart.value!.addSeries(HistogramSeries, {
		priceScaleId: 'left',
		color: '#26a69a',
		priceLineVisible: false,
	});

	graphA.value.priceScale().applyOptions({
		priceLineVisible: false,
		priceFormat: {
			type: 'volume',

		},
		scaleMargins: {
			top: 0.7, // highest point of the series will be 70% away from the top
			bottom: 0,
		},
	});

	graphB.value = chart.value!.addSeries(LineSeries, {
		color: '#fff',
		lineWidth: 2,
		priceLineVisible: false,
		lastPriceAnimation: LastPriceAnimationMode.Continuous,
	});

	const tooltipPrimitive = new TooltipPrimitive({
		lineColor: 'rgba(0, 0, 0, 0.2)',
		tooltip: {
			followMode: 'tracking',
		},
	});

	graphB.value.attachPrimitive(tooltipPrimitive);


	selectRange(currentRange.value);

	chart.value!.timeScale().fitContent();
});


</script>

<template>
	<div :class="classes.wrapper" :style="{ height: `${height}px` }">
		<div ref="container" :class="classes.mainChart"></div>

		<div :class="classes.instruments">
			<chart-range
				class="range"
				:active-range="currentRange"
				:list="[ RangeChart['1M'], RangeChart['1Y'], RangeChart['3Y'], RangeChart['5Y'], RangeChart['10Y'] ]"
				@select="selectRange"
			/>

			<div :class="classes.legend">

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleReport]"></div>
					<span>D. Yield</span>
				</div>

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleEstimate]"></div>
					<span>D. Payment</span>
				</div>


				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleNextPayment]"></div>
					<span>Next Payment</span>
				</div>

			</div>
		</div>
	</div>
</template>

<style scoped>
.range {
	background-color: inherit;
}

.range:deep(.rangeItem) {
	max-width: 55px;
	color: #9a9a9d;
	background-color: inherit;
}

.range:deep(.rangeItemActive) {
	color: #ffffff;
}
</style>

<style module="classes">
.wrapper {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.mainChart {
	flex-grow: 1;
	width: 100%;
	height: 100%;
}

.legend {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	width: calc(100% - 56px);
	padding: 17px 16px;
	gap: 31px;
}

.legendItem {
	display: flex;
	align-items: center;
	gap: 4px;
}

.legendItem span {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
	letter-spacing: 0.08px;
}

.legendCircle {
	width: 6px;
	height: 6px;
	border-radius: 50%;
}

.legendCircleReport {
	background-color: #ffffff;
}

.legendCircleEstimate {
	background-color: #04eda0;
}

.instruments {
	display: flex;
	align-items: center;
	border-top: 1px solid var(--border-color-base-300);
}

.legendCircleNextPayment {
	background-color: rgb(255 191 0 / 60%);
}

:global(a#tv-attr-logo) {
	display: none !important;
}
</style>

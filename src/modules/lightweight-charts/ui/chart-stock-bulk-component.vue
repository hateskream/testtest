<script setup lang="ts">
import {
	ColorType,
	createChart,
	LineSeries,
	LineStyle,
	type CandlestickData,
	type IChartApi,
} from 'lightweight-charts';
import { computed, onMounted, ref, useTemplateRef } from 'vue';

import { generateCandleDataFromLineData, generateLineData, groupSeriesByRange, prepareSeries } from '../utils';
import { RangeChart } from '../model';
import { RANGE_IN_SECONDS } from '../const';

import ChartRange from '../components/chart-range.vue';

interface IChartProps {
	// width: number;
	height: number;
}

defineProps<IChartProps>();

const container = useTemplateRef('container');
const chart = ref<IChartApi | null>();

const mainData = ref(generateCandleDataFromLineData(generateLineData(4000, 1)));

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


	graphA.value.setData(prepareSeries(groupedData.value[currentRange.value], 'Line'));
	// eslint-disable-next-line @stylistic/max-len
	graphB.value.setData(prepareSeries(groupedData.value[currentRange.value].map((item) => ({ ...item, close: item.close - 100 })), 'Line'));


	chart.value!.timeScale().fitContent();
}


onMounted(() => {
	chart.value = createChart(container.value as HTMLElement, {
		autoSize: true,
		layout: {
			textColor: '#9A9A9D',
			background: { type: ColorType.Solid, color: '#131315' },
		},
		handleScroll: false,
		handleScale: false,
		rightPriceScale: {
			scaleMargins: {
				top: 0.1, // leave some space for the legend
				bottom: 0.2,
			},

			minimumWidth: 55,
			borderVisible: false,
		},
		timeScale: {
			tickMarkMaxCharacterLength: 1,

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
	});


	chart.value!.timeScale().applyOptions({
		borderColor: 'rgba(4, 237, 160, 0.00)',
	});

	graphA.value = chart.value!.addSeries(LineSeries, {
		color: '#999999',
		lineWidth: 1,
		priceLineVisible: false,
	});


	graphB.value = chart.value!.addSeries(LineSeries, {
		color: '#FF7F35',
		lineWidth: 1,
		priceLineVisible: false,
	});


	selectRange(currentRange.value);
});


</script>

<template>
	<div :class="classes.wrapper" :style="{ height: `${height}px` }">
		<div ref="container" :class="classes.mainChart"></div>

		<div :class="classes.instruments">
			<chart-range
				:class="classes.range"
				:active-range="currentRange"
				:list="[ RangeChart['6M'], RangeChart['1Y'] ]"
				@select="selectRange"
			/>

			<div :class="classes.legend">

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleReport]"></div>
					<span>TSLA $204.70</span>
				</div>

				<div :class="classes.legendItem">
					<div :class="[classes.legendCircle, classes.legendCircleEstimate]"></div>
					<span>Peers Avg $185.50</span>
				</div>

			</div>
		</div>
	</div>
</template>

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
	border-top: 1px solid var(--border-color-base-300);
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
	background-color: #d9d9d9;
}

.legendCircleEstimate {
	background-color: #ff7f35;
}

.instruments {
	display: flex;
	align-items: center;
}

.range {
	max-width: 92px;
}

:global(a#tv-attr-logo) {
	display: none !important;
}
</style>

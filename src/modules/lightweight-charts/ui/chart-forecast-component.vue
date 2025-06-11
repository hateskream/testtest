<script setup lang="ts">
import {
	ColorType,
	createChart,
	LineSeries,
	LineStyle,
	LineType,
	PriceLineSource,
	type IChartApi,
	type Time,
} from 'lightweight-charts';
import { onMounted, ref, useTemplateRef } from 'vue';

import { generateCandleDataFromLineData, generateLineData, prepareSeries } from '../utils';
import { Rectangle } from '../rectangles';

interface IChartProps {
	width: number;
	height: number;
}

defineProps<IChartProps>();

const container = useTemplateRef('container');
const chart = ref<IChartApi | null>();

const mainData = ref(generateCandleDataFromLineData(generateLineData(50, 7)));

onMounted(() => {
	chart.value = createChart(container.value as HTMLElement, {
		autoSize: true,
		layout: {
			textColor: '#9A9A9D',
			background: { type: ColorType.Solid, color: 'rgb(12 12 13 / 100%)' },
		},
		handleScroll: false,
		handleScale: false,
		rightPriceScale: {
			scaleMargins: {
				top: 0.3, // leave some space for the legend
				bottom: 0.25,
			},

			minimumWidth: 55,
			borderVisible: false,
		},
		// hide the grid lines
		grid: {
			vertLines: {
				visible: false,
			},
			horzLines: {
				visible: false,
			},
		},
		timeScale: {
			visible: false,
		},
	});


	chart.value!.timeScale().applyOptions({
		borderColor: 'rgba(4, 237, 160, 0.00)',

	});

	const s = chart.value!.addSeries(LineSeries, {
		color: '#999999',
		lineWidth: 1,
		priceLineColor: '#CDCDCD',
	});

	s.setData(prepareSeries(mainData.value, 'Line'));


	const priceTargetUp = chart.value!.addSeries(LineSeries, {
		lineType: LineType.Curved,
		color: '#E3FF47',
		lineStyle: LineStyle.Dashed,
		crosshairMarkerVisible: false,
		lineWidth: 1,
		lastValueVisible: true,
		priceLineSource: PriceLineSource.LastVisible,
		priceLineColor: '#373737',
	});

	const generatePriceForecast = (max: number = 100) => {
		const samples = [];
		const d = new Date(mainData.value[mainData.value.length - 1].time as number * 1000);

		const days = 20;

		const maxPoint = max / days;

		let currentMax = mainData.value[mainData.value.length - 1].close;

		for (let i = 0; i < days; i++) {
			const time = (d.getTime() / 1000) as Time;

			samples.push({
				value: currentMax,
				time: time,
			});

			currentMax += maxPoint * i / 12;


			d.setUTCDate(d.getUTCDate() + 1);
		}


		return samples;
	};

	priceTargetUp.setData(generatePriceForecast(250));

	const priceTargetAvg = chart.value!.addSeries(LineSeries, {
		lineType: LineType.Simple,
		lineStyle: LineStyle.Dashed,
		crosshairMarkerVisible: false,
		lineWidth: 1,
		priceLineColor: '#373737',
		color: '#E3FF47',
		lastValueVisible: true,
	});
	const das = generatePriceForecast(200);

	priceTargetAvg.setData(generatePriceForecast(100));

	const priceTargetDown = chart.value!.addSeries(LineSeries, {
		lineType: LineType.Simple,
		color: '#FC4A6B',
		lineStyle: LineStyle.Dashed,
		crosshairMarkerVisible: false,
		lineWidth: 1,
		lastValueVisible: true,
		priceLineColor: '#373737',
	});

	priceTargetDown.setData(generatePriceForecast(-100));

	priceTargetAvg.attachPrimitive(new Rectangle({
		price: das[0].value,
		time: das[0].time,
	}, {
		price: das[das.length - 1].value,
		time: das[das.length - 1].time,
	}));

	chart.value!.timeScale().fitContent();
});


</script>

<template>
	<div :class="classes.wrapper" :style="{ height: `${height}px` }">
		<div ref="container" :class="classes.mainChart"></div>
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

:global(a#tv-attr-logo) {
	display: none !important;
}
</style>

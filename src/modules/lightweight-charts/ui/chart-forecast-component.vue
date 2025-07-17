<script setup lang="ts">
import {
	ColorType,
	createChart,
	LineSeries,
	LineStyle,
	LineType,
	type IChartApi,
	type Time,
} from 'lightweight-charts';
import { onMounted, ref, useTemplateRef } from 'vue';

import { generateCandleDataFromLineData, generateLineData, prepareSeries } from '../utils';
import { Rectangle, TooltipPrimitive } from '../rectangles';

interface IChartProps {
	// width: number;
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
			background: { type: ColorType.Solid, color: '#131315' },

		},
		handleScroll: false,
		handleScale: false,
		rightPriceScale: {
			scaleMargins: {
				top: 0.1, // leave some space for the legend
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
				visible: true,
				color: '#373737',
				style: LineStyle.Dashed,
			},
		},
		timeScale: {
			visible: false,
			lockVisibleTimeRangeOnResize: true,
		},
	});


	chart.value!.timeScale().applyOptions({
		borderColor: 'rgba(4, 237, 160, 0.00)',
	});

	const s = chart.value!.addSeries(LineSeries, {
		color: '#FFF',
		lineWidth: 1,
	});

	const currentPrice = mainData.value[mainData.value.length - 1].close;

	s.setData(prepareSeries(mainData.value, 'Line'));

	s.createPriceLine({
		price: currentPrice,
		axisLabelVisible: true,
		axisLabelColor: '#1C1C1E',
		axisLabelTextColor: '#fff',
		color: '#fff',
		lineVisible: true,
		lineStyle: LineStyle.Dashed,
		lineWidth: 1,
		title: `C ${currentPrice.toFixed(2)}`,
	});

	const tooltipPrimitive = new TooltipPrimitive({
		lineColor: 'rgba(0, 0, 0, 0.2)',
		tooltip: {
			followMode: 'tracking',
		},
	});

	s.attachPrimitive(tooltipPrimitive);

	const generatePriceForecast = (max: number = 100) => {
		const samples = [];
		const d = new Date(mainData.value[mainData.value.length - 1].time as number * 1000);

		const days = 20;

		const maxPoint = max / days;

		let currentMax = mainData.value[mainData.value.length - 1].close;

		for (let i = 0; i < days; i+=1) {
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

	const [priceUp, priceAvg, priceDown] = [
		generatePriceForecast(250),
		generatePriceForecast(100),
		generatePriceForecast(-100),
	];


	const priceTargetUp = chart.value!.addSeries(LineSeries, {
		color: priceUp[priceUp.length - 1].value >= currentPrice ? '#04EDA0' : '#FC4A6B',
		lineType: LineType.Curved,
		lineStyle: LineStyle.Dashed,
		crosshairMarkerVisible: false,
		lineWidth: 1,
		priceLineVisible: false,
	});


	priceTargetUp.setData(priceUp);

	priceTargetUp.createPriceLine({
		price: priceUp[priceUp.length - 1].value,
		axisLabelVisible: true,

		...(
			priceUp[priceUp.length - 1].value >= currentPrice ? {

				axisLabelColor: '#043222',
				axisLabelTextColor: '#04EDA0',
			} : {
				axisLabelColor: '#3B1C24',
				axisLabelTextColor: '#FC4A6B',
			}
		),

		lineVisible: false,
		title: `H ${priceUp[priceUp.length - 1].value.toFixed(2)}`,
	});

	const priceTargetAvg = chart.value!.addSeries(LineSeries, {
		lineType: LineType.Simple,
		lineStyle: LineStyle.Dashed,
		crosshairMarkerVisible: false,
		lineWidth: 1,
		color: '#04EDA0',
		priceLineVisible: false,
	});

	priceTargetAvg.createPriceLine({
		price: priceAvg[priceAvg.length - 1].value,
		axisLabelVisible: true,
		lineVisible: false,
		title: `A ${priceAvg[priceAvg.length - 1].value.toFixed(2)}`,

		...(
			priceAvg[priceAvg.length - 1].value >= currentPrice ? {

				axisLabelColor: '#043222',
				axisLabelTextColor: '#04EDA0',
			} : {
				axisLabelColor: '#3B1C24',
				axisLabelTextColor: '#FC4A6B',
			}
		),
	});

	priceTargetAvg.setData(priceAvg);

	const priceTargetDown = chart.value!.addSeries(LineSeries, {
		lineType: LineType.Simple,
		color: '#FC4A6B',
		lineStyle: LineStyle.Dashed,
		crosshairMarkerVisible: false,
		lineWidth: 1,
		lastValueVisible: true,
		priceLineVisible: false,
	});

	priceTargetDown.setData(priceDown);

	priceTargetDown.createPriceLine({
		price: priceDown[priceDown.length - 1].value,
		title: `L ${priceDown[priceDown.length - 1].value.toFixed(2)}`,
		axisLabelVisible: true,
		lineVisible: false,

		...(
			priceDown[priceDown.length - 1].value >= currentPrice ? {

				axisLabelColor: '#043222',
				axisLabelTextColor: '#04EDA0',
			} : {
				axisLabelColor: '#3B1C24',
				axisLabelTextColor: '#FC4A6B',
			}
		),
	});

	priceTargetAvg.attachPrimitive(new Rectangle({
		price: priceAvg[0].value,
		time: priceAvg[0].time,
	}, {
		price: priceAvg[priceAvg.length - 1].value,
		time: priceAvg[priceAvg.length - 1].time,
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
	position: relative;
	flex-grow: 1;
	width: 100%;
	height: 100%;
}

:global(a#tv-attr-logo) {
	display: none !important;
}
</style>

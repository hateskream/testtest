<script setup lang="ts">
import {
	ColorType,
	createChart,
	LineSeries,
	LineStyle,
	PriceScaleMode,
	type IChartApi,
	type LineData,
	type Time,
} from 'lightweight-charts';
import { onMounted, ref, useTemplateRef } from 'vue';
import { addYears } from 'date-fns';


interface IChartProps {
	// width: number;
	height: number;
}

defineProps<IChartProps>();

const container = useTemplateRef('container');
const chart = ref<IChartApi | null>();


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
			mode: PriceScaleMode.Normal,
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
			borderVisible: true,
			borderColor: 'rgb(97 97 97 / 30%)',
			minimumHeight: 8,
			lockVisibleTimeRangeOnResize: true,
		},
	});


	let d = new Date(Date.UTC(2005, 0, 0, 12, 0, 0, 0));

	const dataLeft: LineData[] = Array.from({ length: 6 }).map(() => {
		d = addYears(d, 1);

		const value = Math.round(Math.random() * 100);


		return {
			value,
			time: d.getTime() / 1000 as Time,
			color: '#fff',
		};
	});

	const dataRight = Array.from({ length: 3 }).map((_, idx) => {
		const value = Math.round(Math.random() * 100);
		if (idx === 0) {
			return {
				color: '#FF8D29',
				value: dataLeft[dataLeft.length - 1].value,
				time: d.getTime() / 1000 as Time,
			};
		}

		d = addYears(d, 1);


		return {
			color: '#FF8D29',
			value,
			time: d.getTime() / 1000 as Time,
		};
	});


	chart.value!.addSeries(LineSeries, {
		priceLineVisible: false,
		pointMarkersVisible: true,
		lineWidth: 1,
		pointMarkersRadius: 2,
		baseLineWidth: 1,
	}).setData(dataLeft);


	chart.value!.addSeries(LineSeries, {
		priceLineVisible: false,
		pointMarkersVisible: true,
		lineWidth: 1,
		pointMarkersRadius: 2,
		baseLineWidth: 1,
	}).setData(dataRight);


	chart.value!.timeScale().fitContent();
});
</script>

<template>
	<div :class="classes.wrapper" :style="{ height: `${height}px` }">
		<div ref="container" :class="classes.mainChart"></div>

		<div :class="classes.legend">

			<div :class="classes.legendItem">
				<div :class="[classes.legendCircle, classes.legendCircleReport]"></div>
				<span>Reported</span>
			</div>

			<div :class="classes.legendItem">
				<div :class="[classes.legendCircle, classes.legendCircleEstimate]"></div>
				<span>Estimate</span>
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

:global(a#tv-attr-logo) {
	display: none !important;
}
</style>

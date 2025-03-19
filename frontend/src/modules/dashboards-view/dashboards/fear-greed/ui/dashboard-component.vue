<script setup lang="ts">
import { computed, ref } from 'vue';

import type { ITension, ITensionTextData } from '../model/tension.ts';
import { useMapTension } from '../composables/use-map-tension.ts';
import { BaseDashboardComponent } from '../../base/index.ts';
import { getMockData } from '../api/get-tension.ts';
// import { useQueryTension } from '../queries/use-query-tension.ts';

export interface IFearGreedProps {
	market: string;

	showChart?: boolean;
	showChartDescription?: boolean;
}

withDefaults(defineProps<IFearGreedProps>(), {
	showChart: true,
	showChartDescription: true,
});

const { mapTension } = useMapTension();

// const { data } = useQueryTension(props.market);
const data = ref<ITension>(await getMockData());

const tensionText = computed<ITensionTextData>(() => mapTension(data.value?.tension ?? 0));

const history = computed(() =>
	Object.entries(data.value?.history ?? {}).map(([key, val]) => ({
		style: { color: mapTension(val).colors.text },
		name: key,
		tension: val,
	})),
);

async function handleInteractiveUpdate() {
	data.value = await getMockData(true);
}

function polarToCartesian(
	centerX: number,
	centerY: number,
	radius: number,
	angleInDegrees: number,
) {
	const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
	return {
		x: centerX + radius * Math.cos(angleInRadians),
		y: centerY + radius * -Math.sin(angleInRadians),
	};
}

const circleChart = computed(() => {
	const tension = data.value?.tension ?? 0;

	const arrowRotateInDeg = -90 + (tension / 100) * 180;

	const arcLength = 35; // Длина подсвеченной дуги (в градусах)
	const startAngle = -180 - (tension / 100) * 180; // Откуда начинается

	const centerX = 100;
	const centerY = 100;
	const radius = 80;

	const start = polarToCartesian(centerX, centerY, radius, startAngle + arcLength / 2);

	const end = polarToCartesian(centerX, centerY, radius, startAngle - arcLength / 2);

	const chartActiveLineD = `M ${start.x},${start.y} A ${radius},${radius} 0 0,1 ${end.x},${end.y}`;

	return {
		arrowRotateInDeg,
		chartActiveLineAttrs: {
			d: chartActiveLineD,
			stroke: tensionText.value.colors.chart,
		},
	};
});
</script>

<template>
	<base-dashboard-component @click="handleInteractiveUpdate">
		<template #title>
			<h2>Fear & Greed</h2>
		</template>

		<div :class="classes.container">
			<div
				:class="classes.metric"
				:style="{ flexDirection: showChart ? 'column' : 'unset' }"
			>
				<div :class="classes.metricСhart">
					<div
						v-if="showChart"
						:class="classes.metricСhartIndicator"
					>
						<svg
							:class="classes.metricСhartContainer"
							width="200"
							height="100"
							viewBox="0 0 200 100"
						>
							<!-- Фоновая дуга -->
							<path
								:class="classes.metricСhartBg"
								d="M 20,100 A 80,80 0 0,1 180,100"
							/>

							<!-- Активная дуга -->
							<path
								:class="classes.metricСhartActive"
								v-bind="circleChart.chartActiveLineAttrs"
							/>
						</svg>

						<div :class="classes.metricСhartArrowContainer">
							<div
								:class="classes.metricСhartArrow"
								:style="{
									transform: `rotate(${circleChart.arrowRotateInDeg}deg)`,
								}"
							>
								<div :class="classes.metricСhartDot" />
							</div>
						</div>
					</div>

					<h3 :style="{ color: tensionText?.colors.text }">
						{{ data?.tension }}
					</h3>
				</div>

				<div :class="classes.metricDescription">
					<h4>{{ tensionText?.text.main }}</h4>
					<small>{{ tensionText?.text.sub }}</small>
				</div>
			</div>

			<ul
				v-if="history.length > 0"
				:class="classes.history"
			>
				<li
					v-for="item in history"
					:key="item.name"
				>
					<p>{{ item.name }}</p>
					<p :style="item.style">
						{{ item.tension }}
					</p>
				</li>
			</ul>
		</div>
	</base-dashboard-component>
</template>

<style module="classes">
.container {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	max-width: min-content;
	margin-top: 18px;
	gap: 25px 48px;
}

.metric {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 4px;
}

.metricСhart {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}

.metricСhart > h3 {
	font-weight: 460;
	font-size: 28px;
	color: var(--common-color-white-700);
}

.metricDescription {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
}

.metricСhartIndicator {
	position: relative;
	width: 200px;
	height: 100px;
	margin-bottom: -30px;
}

.metricСhartContainer {
	position: absolute;
	top: 0;
	left: 0;
}

.metricСhartBg {
	fill: none;
	stroke: rgb(91 91 91 / 50%);
	stroke-width: 2;
}

.metricСhartActive {
	fill: none;
	stroke-width: 4;
	stroke-linecap: round;
	transition: d 0.5s ease-in-out;
}

.metricСhartArrowContainer {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	width: 100%;
	height: 100%;
}

.metricСhartArrow {
	position: absolute;
	width: 2px;
	height: 77px;
	background:
		linear-gradient(
			225deg,
			rgb(255 255 255 / 20%) 0%,
			rgb(255 255 255 / 20%) 22.5%,
			rgb(255 255 255 / 0%) 48.5%
		);
	transform-origin: bottom right;
	transition: transform 0.5s ease-in-out;
}

.metricСhartDot {
	position: absolute;
	top: -7px;
	left: 50%;
	width: 8px;
	height: 8px;
	background: #ffffff;
	border-radius: 50%;
	box-shadow: 0 0 15px rgb(227 168 119 / 80%);
	transform: translateX(-50%);
}

.metricСhartDot::after {
	content: '';
	position: absolute;
	top: 50%;
	left: 50%;
	width: 28px;
	height: 28px;
	background-color: rgb(255 255 255 / 10%);
	border-radius: 100%;
	transform: translate(-50%, -50%);
	filter: blur(1px);
}

.history {
	width: 100%;
	max-width: 139px;
}

.history li {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 4px;
}

.history li > p:first-child {
	font-weight: 440;
	font-size: 12px;
	color: var(--text-color-base-300);
}

.history li > p:last-child {
	font-weight: 440;
	font-size: 12px;
	color: #ffffff;
}

.metricDescription > h4 {
	font-size: 13px;
	color: var(--common-color-white-700);
}

.metricDescription > small {
	font-weight: 440;
	font-size: 10px;
	color: var(--text-color-base-300);
}
</style>

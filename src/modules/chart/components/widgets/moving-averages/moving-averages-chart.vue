<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

// eslint-disable-next-line @stylistic/max-len
import type { IMovingAveragesSignal, IMovingAveragesSize, IMovingAveragesSettings, IMovingAveragesTextData } from './models/moving-averages';
import { MovingAveragesSignal } from './models/moving-averages';
import { useMapMovingAverages } from './composables/use-map-moving-averages';
import { UiTransitionFade } from '@/shared/ui/transition';

export interface IMovingAveragesChartProps {
	signal: IMovingAveragesSignal;
	viewState: IMovingAveragesSettings;
	size: IMovingAveragesSize;
}

export interface IMovingAveragesChartEmits {
	(e: 'updateInteractive'): void;
}

const props = defineProps<IMovingAveragesChartProps>();

const emits = defineEmits<IMovingAveragesChartEmits>();

const { mapSignal } = useMapMovingAverages();

const signalText = computed<IMovingAveragesTextData>(() => mapSignal(props.signal.signal ?? 0));

const circleChart = computed(() => {
	const signal = props.signal.signal ?? 0;

	// Определяем положение стрелки на основе значения сигнала
	let sectionValue = 1;

	if (signal <= MovingAveragesSignal.strongSell.max) {
		sectionValue = 10; // Strong Sell
	} else if (signal <= MovingAveragesSignal.sell.max) {
		sectionValue = 30; // Sell
	} else if (signal <= MovingAveragesSignal.neutral.max) {
		sectionValue = 50; // Neutral
	} else if (signal <= MovingAveragesSignal.buy.max) {
		sectionValue = 70; // Buy
	} else {
		sectionValue = 90; // Strong Buy
	}

	// Поворот стрелки от -90 до +90 градусов (180 градусов полукруга)
	const arrowRotateInDeg = -90 + (signal / 100) * 180;

	const radius = 80;
	const totalLength = Math.PI * radius;
	const arcAngle = 180 / 4.5;
	const arcLength = (arcAngle / 180) * totalLength;

	const signOffset = signal === 100 ? -1 : -(sectionValue / 100);
	const offset = signOffset * (totalLength - arcLength);

	return {
		arrowRotateInDeg,
		activeLine: {
			radius,
			dasharray: `${arcLength}, ${totalLength}`,
			offset,
		},
	};
});

const metricTextStyles = computed<CSSProperties>(() => ({
	marginTop: props.viewState.isShowChart && props.size.h > 2 ? '-30px' : 0,
}));

const isShowChart = computed(() => props.viewState.isShowChart && props.size.h > 2);
const isShowDescription = computed(() => props.viewState.isShowDescription && props.size.h > 2);
</script>

<template>
	<div :class="classes.container">
		<div
			:class="classes.metric"
			@click.stop.prevent="emits('updateInteractive')"
		>
			<div
				v-if="isShowChart"
				:class="classes.metricСhart"
			>
				<svg
					width="200"
					height="100"
					viewBox="0 0 200 100"
					:class="classes.metricСhartContainer"
				>
					<!-- Фоновая дуга -->
					<path
						:class="classes.metricСhartBg"
						d="M 20,100 A 80,80 0 0,1 180,100"
					/>

					<!-- Секторы (опционально, можно добавить разметку) -->
					<!-- Strong Sell -->
					<!-- <path
						d="M 20,100 A 80,80 0 0,1 56,42"
						:class="classes.sectorStrongSell"
						stroke="#FF4444"
						stroke-width="1"
						fill="none"
						opacity="0.3"
					/> -->
					<!-- Sell -->
					<!-- <path
						d="M 56,42 A 80,80 0 0,1 100,20"
						:class="classes.sectorSell"
						stroke="#FF7744"
						stroke-width="1"
						fill="none"
						opacity="0.3"
					/> -->
					<!-- Neutral -->
					<!-- <path
						d="M 100,20 A 80,80 0 0,1 144,42"
						:class="classes.sectorNeutral"
						stroke="#888888"
						stroke-width="1"
						fill="none"
						opacity="0.3"
					/> -->
					<!-- Buy -->
					<!-- <path
						d="M 144,42 A 80,80 0 0,1 180,100"
						:class="classes.sectorBuy"
						stroke="#44AA44"
						stroke-width="1"
						fill="none"
						opacity="0.3"
					/> -->

					<!-- Активная дуга -->
					<path
						d="M 20,100 A 80,80 0 0,1 180,100"
						:class="classes.metricСhartActive"
						:stroke="signalText.colors.chart"
						:stroke-dasharray="circleChart.activeLine.dasharray"
						:stroke-dashoffset="circleChart.activeLine.offset"
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

				<!-- Лейблы секторов -->
				<div :class="classes.labels">
					<div :class="[classes.label, classes.labelStrongSell]">Strong<br />Sell</div>
					<div :class="[classes.label, classes.labelSell]">Sell</div>
					<div :class="[classes.label, classes.labelNeutral]">Neutral</div>
					<div :class="[classes.label, classes.labelBuy]">Buy</div>
					<div :class="[classes.label, classes.labelStrongBuy]">Strong<br />Buy</div>
				</div>
			</div>

			<div
				:class="classes.metricDescription"
				:style="metricTextStyles"
			>
				<h4 :style="{ color: signalText?.colors.text }">
					<!-- {{ signal.signal }} -->
					<span />
					<br />
					<span />
				</h4>
				<ui-transition-fade>
					<h4 v-if="props.viewState.isShowName">{{ signalText?.text.main }}</h4>
				</ui-transition-fade>
				<ui-transition-fade>
					<small v-if="isShowDescription">
						{{ signalText?.text.sub }}
					</small>
				</ui-transition-fade>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin-top: 12px;
	gap: 25px 32px;
}

.metric {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 180px;
}

.metricDescription > h3 {
	font-weight: 460;
	font-size: 28px;
	color: var(--common-color-white-700);
}

.metricDescription {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	height: 70px;
}

.metricСhart {
	position: relative;
	width: 200px;
	height: 100px;
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
	transition: stroke-dashoffset 0.7s ease-in-out;
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
	/* stylelint-disable-next-line declaration-colon-newline-after */
	background: linear-gradient(
		225deg,
		rgb(255 255 255 / 20%) 0%,
		rgb(255 255 255 / 20%) 22.5%,
		rgb(255 255 255 / 0%) 48.5%
	);
	transform-origin: bottom right;
	transition: transform 0.7s ease-in-out;
}

.metricСhartDot {
	position: absolute;
	top: -7px;
	left: 50%;
	width: 8px;
	height: 8px;
	background: #ffffff;
	border-radius: 50%;
	box-shadow: 0 0 15px rgb(255 255 255 / 50%);
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

.labels {
	position: absolute;
	top: 0;
	left: 0;
	width: 200px;
	height: 100px;
	pointer-events: none;
}

.label {
	position: absolute;
	font-size: 10px;
	line-height: 1.1;
	text-align: center;
	color: var(--text-color-base-500);
	letter-spacing: 0.096px;
}

.labelStrongSell {
	top: 70px;
	left: -15px;
}

.labelSell {
	top: 20px;
	left: 20px;
}

.labelNeutral {
	top: 0;
	left: 50%;
	transform: translateX(-50%);
}

.labelBuy {
	top: 20px;
	right: 20px;
}

.labelStrongBuy {
	top: 70px;
	right: -15px;
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

/* Стили для секторов */
.sectorStrongSell,
.sectorSell,
.sectorNeutral,
.sectorBuy,
.sectorStrongBuy {
	transition: opacity 0.3s ease;
}
</style>

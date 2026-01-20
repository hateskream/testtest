<script setup lang="ts">
import { computed } from 'vue';

import {
	type ITension,
	type ITensionTextData,
	Tension,
} from '@/modules/widgets/fear-greed/model';

interface IProps {
	tension: ITension;
	text: ITensionTextData;
}

const props = defineProps<IProps>();

const circleChart = computed(() => {
	const tension = props.tension.tension ?? 0;

	let val = 1;

	if (tension <= Tension.extremeFear.max) {
		val = 1;
	} else if (tension <= Tension.fear.max) {
		val = 25;
	} else if (tension <= Tension.neutral.max) {
		val = 50;
	} else if (tension <= Tension.greed.max) {
		val = 75;
	} else if (tension <= Tension.extremeGreed.max) {
		val = 99;
	}

	const arrowRotateInDeg = -90 + (tension / 100) * 180;

	const radius = 80;

	const totalLength = Math.PI * radius;
	const arcAngle = 180 / 4.5;
	const arcLength = (arcAngle / 180) * totalLength;

	const signOffset = tension === 100 ? -1 : -(val / 100);

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
</script>

<template>
	<div :class="classes.metricСhart">
		<svg
			width="200"
			height="100"
			viewBox="0 0 200 100"
			:class="classes.metricСhartContainer"
		>
			<path
				:class="classes.metricСhartBg"
				d="M 20,100 A 80,80 0 0,1 180,100"
			/>

			<path
				d="M 20,100 A 80,80 0 0,1 180,100"
				:class="classes.metricСhartActive"
				:stroke="props.text.colors.chart"
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
	</div>
</template>

<style module="classes">
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
	width: 8px;
	height: 77px;
	transform-origin: bottom right;
	transition: transform 0.7s ease-in-out;
}

.metricСhartDot {
	position: absolute;
	top: -5px;
	left: 50%;
	width: 4px;
	height: 20px;
	background: url('@/assets/icons/fear-greed-gauge-arrow.svg') no-repeat center center;
	border-radius: 50%;
	transform: translateX(-50%);
}

/* .metricСhartDot::after {
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
} */

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

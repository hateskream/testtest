<script setup lang="ts">
import { computed } from 'vue';

import type { ISpeedometerSegment } from './types';

interface IProps {
	value: number;
	color: string;
	segments: readonly ISpeedometerSegment[];
}

const props = defineProps<IProps>();

const chart = computed(() => {
	const value = props.value ?? 0;

	const segment = props.segments.find(s => value <= s.max) ?? props.segments[props.segments.length - 1];
	const val = segment.position;

	const arrowRotateInDeg = -90 + (value / 100) * 180;

	const diameter = 80;
	const totalLength = Math.PI * diameter;
	const arcAngle = 180 / 4.5;
	const arcLength = (arcAngle / 180) * totalLength;

	const signOffset = value === 100 ? -1 : -(val / 100);
	const offset = signOffset * (totalLength - arcLength);

	return {
		arrowRotateInDeg,
		activeLine: {
			dasharray: `${arcLength}, ${totalLength}`,
			offset,
		},
	};
});
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.chart">
			<svg
				width="200"
				height="100"
				viewBox="0 0 200 100"
				:class="classes.svg"
			>
				<path
					:class="classes.bg"
					d="M 20,100 A 80,80 0 0,1 180,100"
				/>

				<path
					d="M 20,100 A 80,80 0 0,1 180,100"
					:class="classes.active"
					:stroke="props.color"
					:stroke-dasharray="chart.activeLine.dasharray"
					:stroke-dashoffset="chart.activeLine.offset"
				/>
			</svg>

			<div :class="classes.arrowContainer">
				<div
					:class="classes.arrow"
					:style="{
						transform: `rotate(${chart.arrowRotateInDeg}deg)`,
					}"
				>
					<div :class="classes.dot" />
				</div>
			</div>
		</div>

		<slot />
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.chart {
	position: relative;
	width: 200px;
	height: 100px;
}

.svg {
	position: absolute;
	top: 0;
	left: 0;
}

.bg {
	fill: none;
	stroke: rgb(91 91 91 / 50%);
	stroke-width: 2;
}

.active {
	fill: none;
	stroke-width: 4;
	stroke-linecap: round;
	transition: stroke-dashoffset 0.7s ease-in-out;
}

.arrowContainer {
	position: absolute;
	top: 0;
	left: 0;
	display: flex;
	justify-content: center;
	align-items: flex-end;
	width: 100%;
	height: 100%;
}

.arrow {
	position: absolute;
	width: 8px;
	height: 77px;
	transform-origin: bottom right;
	transition: transform 0.7s ease-in-out;
}

.dot {
	position: absolute;
	top: -5px;
	left: 50%;
	width: 4px;
	height: 20px;
	background: url('@/assets/icons/fear-greed-gauge-arrow.svg') no-repeat center center;
	border-radius: 50%;
	transform: translateX(-50%);
}
</style>

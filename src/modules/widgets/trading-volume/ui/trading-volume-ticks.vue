<script setup lang="ts">
import { watch, onMounted, useTemplateRef } from 'vue';

import { TradingVolumeSentiment, type TradingVolumeSentimentType } from '../model';

const props = defineProps<{
	width: number;
	ratio: number;
	status: TradingVolumeSentimentType;
}>();

const canvasRef = useTemplateRef('canvas');

const CANVAS_HEIGHT = 15;
const GAP = 3;

const TICK_WIDTH = 1.571;
const TICK_HEIGHT = 12.9;

const TIP_WIDTH = 3.142;
const TIP_HEIGHT = 15;

const BAR_HEIGHT = 13;

const DIMMED_COLOR = 'rgba(73, 73, 80, 0.44)';

const COLOR_MAP = {
	[TradingVolumeSentiment.Negative]: {
		tick: 'rgba(252, 29, 77, 0.30)',
		bar: '#72192D',
		tip: '#FC1D4D',
	},
	[TradingVolumeSentiment.Positive]: {
		tick: 'rgba(4, 237, 160, 0.20)',
		bar: '#0F6C4E',
		tip: '#04EDA0',
	},
	[TradingVolumeSentiment.Neutral]: {
		tick: 'rgba(255, 255, 255, 0.15)',
		bar: 'rgba(255, 255, 255, 0.25)',
		tip: 'rgba(255, 255, 255, 0.50)',
	},
} as const;

function calcTickCount(containerWidth: number): number {
	return Math.floor((containerWidth + GAP) / (TICK_WIDTH + GAP));
}

function draw(): void {
	const canvas = canvasRef.value;

	if (!canvas || props.width <= 0) {
		return;
	}

	const dpr = window.devicePixelRatio || 1;
	const w = props.width;

	canvas.width = w * dpr;
	canvas.height = CANVAS_HEIGHT * dpr;
	canvas.style.width = `${w}px`;
	canvas.style.height = `${CANVAS_HEIGHT}px`;

	const ctx = canvas.getContext('2d');

	if (!ctx) {
		return;
	}

	ctx.scale(dpr, dpr);
	ctx.clearRect(0, 0, w, CANVAS_HEIGHT);

	const colors = COLOR_MAP[props.status];
	const count = calcTickCount(w);
	const center = Math.floor(count / 2);
	const barTickCount = Math.max(1, Math.round(props.ratio * center));

	const tickPositions: number[] = [];
	let x = 0;

	for (let i = 0; i < count; i++) {
		tickPositions.push(x);
		x += TICK_WIDTH + GAP;
	}

	const isNegative = props.status === TradingVolumeSentiment.Negative;
	const isPositive = props.status === TradingVolumeSentiment.Positive;

	let barStartIdx: number;
	let barEndIdx: number;
	let coloredEndIdx: number;

	if (isNegative) {
		barStartIdx = center - barTickCount;
		barEndIdx = center;
		coloredEndIdx = center;
	} else if (isPositive) {
		barStartIdx = center;
		barEndIdx = center + barTickCount;
		coloredEndIdx = center + barTickCount;
	} else {
		barStartIdx = center - barTickCount;
		barEndIdx = center + barTickCount;
		coloredEndIdx = center;
	}

	const tickY = (CANVAS_HEIGHT - TICK_HEIGHT) / 2;

	for (let i = 0; i < count; i++) {
		ctx.fillStyle = i < coloredEndIdx ? colors.tick : DIMMED_COLOR;
		ctx.beginPath();
		ctx.rect(tickPositions[i], tickY, TICK_WIDTH, TICK_HEIGHT);
		ctx.fill();
	}

	if (barTickCount > 0 && barStartIdx >= 0 && barEndIdx <= count) {
		const barStartX = tickPositions[barStartIdx];
		const barEndX = tickPositions[barEndIdx - 1] + TICK_WIDTH;
		const barWidth = barEndX - barStartX;
		const barY = (CANVAS_HEIGHT - BAR_HEIGHT) / 2;

		ctx.fillStyle = colors.bar;
		ctx.beginPath();
		ctx.rect(barStartX, barY, barWidth, BAR_HEIGHT);
		ctx.fill();

		const tipX = isPositive ? barEndX - TIP_WIDTH : barStartX;
		const tipY = (CANVAS_HEIGHT - TIP_HEIGHT) / 2;

		ctx.fillStyle = colors.tip;
		ctx.beginPath();
		ctx.rect(tipX, tipY, TIP_WIDTH, TIP_HEIGHT);
		ctx.fill();
	}
}

onMounted(() => {
	draw();
});

watch(() => [props.width, props.ratio, props.status], () => {
	draw();
});
</script>

<template>
	<div :class="classes.container">
		<canvas ref="canvas" :class="classes.canvas" />
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	flex: 1;
	align-items: center;
	height: 15px;
}

.canvas {
	display: block;
}
</style>

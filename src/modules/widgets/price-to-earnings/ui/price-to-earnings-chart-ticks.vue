<script setup lang="ts">
import { watch, onMounted, useTemplateRef } from 'vue';

import type { PriceToEarningsItem } from '../model';

const props = defineProps<{
	width: number;
	item: PriceToEarningsItem;
}>();

const canvasRef = useTemplateRef('canvas');

const CANVAS_HEIGHT = 17;
const GAP = 5;

const SMALL_WIDTH = 2;
const SMALL_HEIGHT = 9;

const MEDIUM_WIDTH = 2.73;
const MEDIUM_HEIGHT = 13;

const INDICATOR_WIDTH = 5.5;
const INDICATOR_HEIGHT = 17;

const FILLED_COLOR = 'rgba(255, 255, 255, 0.90)';
const DIMMED_COLOR = 'rgba(73, 73, 80, 0.44)';

function calcTickCount(containerWidth: number): number {
	const avgTickWidth = (SMALL_WIDTH + MEDIUM_WIDTH) / 2;
	const tickWithGap = avgTickWidth + GAP;

	return Math.floor((containerWidth + GAP) / tickWithGap);
}

function draw() {
	const canvas = canvasRef.value;

	if (!canvas || props.width <= 0) {
		return;
	}

	const dpr = window.devicePixelRatio || 1;
	const containerWidth = props.width;
	const count = calcTickCount(containerWidth);
	const active = Math.round((props.item.value / props.item.max) * count);

	canvas.width = containerWidth * dpr;
	canvas.height = CANVAS_HEIGHT * dpr;
	canvas.style.width = `${containerWidth}px`;
	canvas.style.height = `${CANVAS_HEIGHT}px`;

	const ctx = canvas.getContext('2d');

	if (!ctx) {
		return;
	}

	ctx.scale(dpr, dpr);
	ctx.clearRect(0, 0, containerWidth, CANVAS_HEIGHT);

	let x = 0;

	for (let i = 1; i <= count; i++) {
		let w: number;
		let h: number;

		if (i === active) {
			w = INDICATOR_WIDTH;
			h = INDICATOR_HEIGHT;
		} else if (i % 2 !== 0) {
			w = MEDIUM_WIDTH;
			h = MEDIUM_HEIGHT;
		} else {
			w = SMALL_WIDTH;
			h = SMALL_HEIGHT;
		}

		const color = i <= active ? FILLED_COLOR : DIMMED_COLOR;
		const y = (CANVAS_HEIGHT - h) / 2;

		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.roundRect(x, y, w, h, 1);
		ctx.fill();

		x += w + GAP;
	}
}

onMounted(() => {
	draw();
});

watch(() => [props.width, props.item], () => {
	draw();
}, { deep: true });
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
	height: 17px;
}

.canvas {
	display: block;
}
</style>

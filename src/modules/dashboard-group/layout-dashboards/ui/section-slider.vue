<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import { useSlider } from '../composables';
import { IconIds, UiIcon } from '@/shared/ui/icon';

import SectionComponent from './section-component.vue';

const slides = [
	{ name: '#FF6B6B', width: 360 },
	{ name: '#FFD93D', width: 300 },
	{ name: '#6BCB77', width: 320 },
	{ name: '#4D96FF', width: 340 },
	{ name: '#9B5DE5', width: 380 },
	{ name: '#F15BB5', width: 320 },
	{ name: '#FF6B6B', width: 320 },
	{ name: '#FFD93D', width: 300 },
	{ name: '#6BCB77', width: 320 },
	{ name: '#4D96FF', width: 340 },
	{ name: '#9B5DE5', width: 380 },
	{ name: '#F15BB5', width: 320 },
];

const gap = 0;

const viewportEl = useTemplateRef('viewport');

const { translateX, pointerState, canNext, canPrev, next, prev } = useSlider({
	slidesWidth: slides.map((s) => s.width),
	gap,
	viewportEl,
});

const trackStyle = computed(() => ({
	transform: `translateX(${translateX.value}px)`,
	gap: `${gap}px`,
}));

function onWheel(e: WheelEvent) {
	pointerState.onWheel(e);
}

function onPointerDown(e: PointerEvent) {
	pointerState.onPointerDown(e);
}
function onPointerMove(e: PointerEvent) {
	pointerState.onPointerMove(e);
}
function onPointerUp(_: PointerEvent) {
	pointerState.onPointerUp();
}
function onTouchStart(e: TouchEvent) {
	pointerState.onTouchStart(e);
}
function onTouchMove(e: TouchEvent) {
	pointerState.onTouchMove(e);
}
function onTouchEnd(_: TouchEvent) {
	pointerState.onTouchEnd();
}
</script>

<template>
	<div
		ref="viewport"
		:class="classes.viewport"
		@wheel="onWheel"
		@pointerdown="onPointerDown"
		@pointermove="onPointerMove"
		@pointerup="onPointerUp"
		@pointercancel="onPointerUp"
		@pointerleave="onPointerUp"
		@touchstart="onTouchStart"
		@touchmove="onTouchMove"
		@touchend="onTouchEnd"
	>
		<div
			:class="classes.track"
			:style="trackStyle"
		>
			<section-component
				v-for="(s, i) in slides"
				:key="i"
				:width="s.width"
				:index="i"
			/>
		</div>
		<!-- <div :class="classes"></div> -->
		<div :class="classes.panel">
			<div :class="classes.content">
				<button
					:disabled="!canPrev"
					:class="classes.control"
					@click="prev"
				>
					<ui-icon :id="IconIds.Prev" />
				</button>
				<button
					:disabled="!canNext"
					:class="classes.control"
					@click="next"
				>
					<ui-icon
						:id="IconIds.Prev"
						:style="{
							transform: `rotate(180deg)`
						}"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.viewport {
	position: relative;
	display: flex;
	flex-grow: 1;
	padding-right: 44px;
}

.track {
	display: flex;
	flex-grow: 1;
	align-items: stretch;
	transition: transform 300ms cubic-bezier(0.22, 0.9, 0.2, 1);
	will-change: transform;
}

/* .track > *:not(:last-child) {
	border-right: 1px solid #1d1d1e;
} */

.track > * {
	border-right: 1px solid #1d1d1e;
}

.panel {
	position: absolute;
	right: 0;
	width: 60px;
	height: 100%;
	padding-left: 16px;
	background: linear-gradient(90deg, rgb(0 0 0 / 0%) 0%, #000000 70%);
}

.content {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 10px;
	gap: 8px;
}

.control {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	color: rgb(255 255 255 / 50%);
	background: rgb(73 73 80 / 32%);
	border-radius: 8px;
	backdrop-filter: blur(4px);
	cursor: pointer;
}

.control:disabled {
	color: rgb(255 255 255 / 50%);
	background: rgb(73 73 80 / 32%);
	border-radius: 8px;
	cursor: not-allowed;
	opacity: 0.7;
	backdrop-filter: blur(4px);
}

.control:hover {
	color: rgb(255 255 255 / 100%);
	background: rgb(73 73 80 / 32%);
	border-radius: 8px;
	backdrop-filter: blur(4px);
}
</style>

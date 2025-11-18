<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { computed } from 'vue';
import { useElementSize } from '@vueuse/core';

import { IconIds, UiIcon } from '@/shared/ui/icon';
import type { ISection } from '../model';

import SectionComponent from './section-component.vue';

interface ISectionSliderProps {
	slides: ISection[];
	trackStyle: {
		transform: string;
	};
	canPrev: boolean;
	canNext: boolean;
}

const props = defineProps<ISectionSliderProps>();

const emits = defineEmits<{
	(e: 'pointerDown', event: PointerEvent): void;
	(e: 'pointerMove', event: PointerEvent): void;
	(e: 'pointerUp'): void;
	(e: 'touchStart', event: TouchEvent): void;
	(e: 'touchMove', event: TouchEvent): void;
	(e: 'touchEnd'): void;
	(e: 'wheel', event: WheelEvent): void;
	(e: 'next'): void;
	(e: 'prev'): void;
	(e: 'goTo', index: number): void;
}>();

const { height } = useElementSize(
	useTemplateRef<HTMLDivElement>('container'),
);

const sectionHeight = computed(() => {
	if (height.value) {
		return height.value - 14;
	}
	return 0;
});
</script>

<template>
	<div :class="classes.root">
		<div
			ref="container"
			:class="classes.viewport"
			@wheel="emits('wheel', $event)"
			@pointerdown="emits('pointerDown', $event)"
			@pointermove="emits('pointerMove', $event)"
			@pointerup="emits('pointerUp')"
			@pointercancel="emits('pointerUp')"
			@pointerleave="emits('pointerUp')"
			@touchstart="emits('touchStart', $event)"
			@touchmove="emits('touchMove', $event)"
			@touchend="emits('touchEnd')"
		>
			<div
				:class="classes.track"
				:style="props.trackStyle"
			>
				<template
					v-for="(s, i) in props.slides"
					:key="s.id"
				>
					<section-component
						:section="s"
						:parent-height="sectionHeight"
						:style="{
							...i !== 0 ? { 'margin-left': '10px' } : {},
							...{ 'margin-right': '10px' }
						}"
					/>
					<div
						:class="classes.sizer"
					/>
				</template>
			</div>
		</div>
		<div :class="classes.maskContainer">

			<div :class="classes.topLeft">
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g transform="scale(-1 1) translate(-32 0)">
						<path
							d="M32 32C32 14.3269 17.6731 1.70846e-07 0 3.81596e-07L32 0L32 32Z"
							fill="rgb(3 3 3 / 100%)"
						/>
					</g>
				</svg>
			</div>


			<div :class="classes.topRight">
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M32 32C32 14.3269 17.6731 1.70846e-07 0 3.81596e-07L32 0L32 32Z"
						fill="rgb(3 3 3 / 100%)"
					/>
				</svg>
			</div>

			<div :class="classes.bottomLeft">
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
					xmlns="http://www.w3.org/2000/svg"
				>
					<g transform="rotate(180 16 16)">
						<path
							d="M32 32C32 14.3269 17.6731 1.70846e-07 0 3.81596e-07L32 0L32 32Z"
							fill="rgb(3 3 3 / 100%)"
						/>
					</g>
				</svg>
			</div>


			<div :class="classes.bottomRight">
				<div :class="classes.blur"></div>
				<svg
					width="32"
					height="32"
					viewBox="0 0 32 32"
				>
					<defs>
						<mask id="path-mask" maskUnits="userSpaceOnUse">
							<path
								d="M0 32C17.6731 32 32 17.6731 32 0L32 32L0 32Z"
								fill="white"
							/>
						</mask>
					</defs>
				</svg>
			</div>
		</div>
		<div :class="classes.content">
			<button
				:disabled="!props.canPrev"
				:class="classes.control"
				@click="emits('prev')"
			>
				<ui-icon :id="IconIds.Prev" />
			</button>
			<button
				:disabled="!props.canNext"
				:class="classes.control"
				@click="emits('next')"
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
</template>

<style module="classes">
.root {
	position: relative;
	display: flex;
	flex-grow: 1;
}

.viewport {
	position: relative;
	display: flex;
	flex-grow: 1;
	margin-right: 6px;
	margin-left: 20px;
	overflow: hidden;
	border-radius: 24px;
}

.track {
	display: flex;
	flex-grow: 1;
	align-items: stretch;
	transition: transform 300ms cubic-bezier(0.22, 0.9, 0.2, 1);
	will-change: transform;
}

.maskContainer {
	position: absolute;
	top: 0;
	left: 0;
	width: calc(100% - 52px);
	height: 100%;
	padding-left: 20px;
	pointer-events: none;
}

.topLeft {
	position: absolute;
	top: 0;
	left: 20px;
	pointer-events: none;
}

.topRight {
	position: absolute;
	top: 0;
	right: 0;
	pointer-events: none;
}

.bottomLeft {
	position: absolute;
	bottom: -3px;
	left: 20px;
	pointer-events: none;
}

.bottomRight {
	position: absolute;
	right: 0;
	bottom: 0;
	width: 32px;
	height: 32px;
	color: rgb(0 0 0 / 74%);
	pointer-events: none;
}

.blur {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: #000000bd;
	backdrop-filter: blur(12px);
	/* stylelint-disable-next-line function-url-quotes */
	mask-image: url(#path-mask);
	mask-repeat: no-repeat;
	mask-position: center;
	mask-size: contain;
}

.content {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	min-width: 52px;
	height: 100%;
	padding-top: 10px;
	background: rgb(0 0 0 / 74%);
	gap: 8px;
	backdrop-filter: blur(12px);
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

.sizer {
	width: 3px;
	height: 32px;
	margin: auto;
	background: #d9d9d9;
	border-radius: 4px;
	cursor: grab;
	opacity: 0.3;
}

@media (max-width: 768px) {
	.panel {
		display: none;
	}
}
</style>

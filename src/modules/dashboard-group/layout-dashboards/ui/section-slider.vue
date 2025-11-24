<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
import { useElementSize } from '@vueuse/core';

import type { ISection, ISectionWheelPayload } from '../model';

import SectionSidebar from './section-sidebar.vue';
import SectionComponent from './section-component.vue';

interface IPreparedSection extends ISection {
	isVisible: boolean;
}

interface ISectionSliderProps {
	slides: ISection[];
	currentIndex: number;
	canPrev: boolean;
	canNext: boolean;
	translateX: number;
}

const props = defineProps<ISectionSliderProps>();

const emits = defineEmits<{
	(e: 'updateSection', newSection: ISection[]): void;
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

const { height, width } = useElementSize(
	useTemplateRef<HTMLDivElement>('container'),
);

const sectionRefs = ref<InstanceType<typeof SectionComponent>[]>([]);
const sectionWheelState = ref<Record<string, ISectionWheelPayload>>({});

function onSectionWheel(payload: ISectionWheelPayload) {
	sectionWheelState.value[payload.sectionId] = {
		...payload,
	};
}

function scrollToWidget(sectionId: string, widgetId: string) {
	const index = props.slides.findIndex(s => s.id === sectionId);

	if (index !== -1) {
		emits('goTo', index);
	}

	const section = sectionRefs.value.find(
		(s) => s.$props.section.id === sectionId,
	);

	section?.scrollToWidget(widgetId);
}

const preparedSlides = ref<IPreparedSection[]>([]);

const sizeVisibleWidow = computed(() => {
	let acc = 0;
	let index = 0;

	while (acc < width.value && index < props.slides.length) {
		acc += props.slides[index += 1].width;
	}

	return index;
});

watch(
	() => props.slides,
	newSlides => {
		if (sizeVisibleWidow.value === 0) {
			return;
		}

		setPreparedSlides(newSlides, sizeVisibleWidow.value);
	},
	{ immediate: true },
);

watch(
	() => sizeVisibleWidow.value,
	visibleWindowSize => {
		setPreparedSlides(props.slides, visibleWindowSize);
	},
);

watch(
	() => props.currentIndex,
	(newIndex, oldIndex) => {
		if (newIndex === oldIndex || newIndex < oldIndex) {
			return;
		}

		setPreparedSlides(props.slides, sizeVisibleWidow.value + newIndex);
	},
);

function setPreparedSlides(newSlides: ISection[], visibleWindowSize: number) {
	preparedSlides.value = newSlides.map((s, i) => ({
		...s,
		isVisible: i < visibleWindowSize,
	}));
}
</script>

<template>
	<div id="slider" :class="classes.root">
		<div
			ref="container"
			:class="classes.viewport"
			@wheel.capture="emits('wheel', $event)"
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
				:style="{
					transform: `translateX(${props.translateX}px)`
				}"
			>
				<template v-for="(s, i) in props.slides" :key="s.id">
					<section-component
						ref="sectionRefs"
						:section="s"
						:parent-height="height"
						:style="{
							...i !== 0 ? { 'margin-left': '10px' } : {},
							...{ 'margin-right': '10px' }
						}"
						@section-wheel="onSectionWheel"
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

		<section-sidebar
			:slides="props.slides"
			:slides-wheel="sectionWheelState"
			:can-next="props.canNext"
			:can-prev="props.canPrev"
			:translate-x="props.translateX"
			@prev="emits('prev')"
			@next="emits('next')"
			@go-to="emits('goTo', $event)"
			@update-section="emits('updateSection', $event)"
			@scroll-to-widget="scrollToWidget"
		/>
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
	padding-top: 8px;
	overflow: hidden;
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
	top: 8px;
	left: 20px;
	pointer-events: none;
}

.topRight {
	position: absolute;
	top: 8px;
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

.loader {
	display: flex;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
}

.section {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	align-items: center;
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

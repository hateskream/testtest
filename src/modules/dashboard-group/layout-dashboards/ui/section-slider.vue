<script setup lang="ts">
import { ref, useTemplateRef, watch } from 'vue';
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
	visibleSlidesCount: number;
	canPrev: boolean;
	canNext: boolean;
	translateX: number;
}

const props = defineProps<ISectionSliderProps>();

const emits = defineEmits<{
	(e: 'updateSection', newSection: ISection[]): void;
	(e: 'next'): void;
	(e: 'prev'): void;
	(e: 'goTo', index: number): void;
}>();

const trackRef = useTemplateRef<HTMLDivElement>('track');

const { height } = useElementSize(trackRef);

const sectionRefs = useTemplateRef<InstanceType<typeof SectionComponent>[]>('sectionElement');
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

	const section = sectionRefs.value?.find(
		(s) => s?.$props.section.id === sectionId,
	);

	section?.scrollToWidget(widgetId);
}

const preparedSlides = ref<IPreparedSection[]>([]);

watch(
	() => props.slides,
	newSlides => {
		setPreparedSlides(newSlides, props.visibleSlidesCount);
	},
);

watch(
	() => props.visibleSlidesCount,
	(newCount, oldCount) => {
		if (newCount === oldCount || newCount < oldCount) {
			return;
		}

		setPreparedSlides(props.slides, newCount);
	},
);
function setPreparedSlides(newSlides: ISection[], visibleWindowSize: number) {
	preparedSlides.value = newSlides.map((s, i) => ({
		...s,
		isVisible: i < visibleWindowSize,
	}));
}

defineExpose({ trackRef });
</script>

<template>
	<div id="slider" :class="classes.root">
		<div
			ref="track"
			:class="classes.viewport"
		>
			<div

				:class="classes.track"
			>
				<template v-for="(s, i) in preparedSlides" :key="s.id">
					<div
						:class="classes.section"
						:style="{
							...i !== 0 ? { 'margin-left': '10px' } : {},
							...{ 'margin-right': '10px' }
						}"
					>
						<section-component
							ref="sectionElement"
							:section="s"
							:parent-height="height"
							:is-visible="s.isVisible"
							@section-wheel="onSectionWheel"
						/>
					</div>
					<div :class="classes.sizer" />
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
			:current-index="props.currentIndex"
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
	flex-direction: column;
}

.viewport {
	touch-action: none;
	position: relative;
	display: flex;
	flex-grow: 1;
	margin-right: 6px;
	padding-top: 8px;
	padding-left: 20px;
	overflow: hidden;
	overflow-x: auto;
	scroll-snap-type: x mandatory;
	scroll-behavior: smooth;
	-webkit-overflow-scrolling: touch;
	user-select: none;
}

.viewport::-webkit-scrollbar {
	width: 0;
	height: 0;
}

.track {
	display: flex;
	flex-grow: 1;
	align-items: stretch;
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
	left: 0;
	pointer-events: none;
}

.topRight {
	position: absolute;
	top: 8px;
	right: 0;
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

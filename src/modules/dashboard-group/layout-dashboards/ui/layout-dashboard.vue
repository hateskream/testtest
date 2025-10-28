<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { useTemplateRef, computed } from 'vue';

import { useSlider } from '../composables';

import HeaderDesktop from './header-desktop.vue';
import HeaderMobile from './header-mobile.vue';
import SectionSlider from './section-slider.vue';
import PaginationMobile from './pagination-mobile.vue';

const emits = defineEmits<{
	(e: 'close'): void;
}>();

const slides = [
	{ name: '#1', width: 360 },
	{ name: '#2', width: 300 },
	{ name: '#3', width: 320 },
	{ name: '#4', width: 340 },
	{ name: '#5', width: 380 },
	{ name: '#6', width: 320 },
	{ name: '#7', width: 320 },
	{ name: '#8', width: 300 },
	{ name: '#9', width: 320 },
	{ name: '#10', width: 340 },
	{ name: '#11', width: 380 },
	{ name: '#12', width: 320 },
];

const { width } = useElementSize(useTemplateRef('viewport'));

const viewportWidth = computed(() => width.value);

const isMobile = computed(() => viewportWidth.value < 768);

const preparedSlides = computed(
	() => slides
		.map(s => ({
			...s,
			width: isMobile.value ? viewportWidth.value : s.width,
		})),
);

const {
	trackStyle,
	pointerState,
	canNext,
	canPrev,
	currentIndex,
	next,
	prev,
	goTo,
} = useSlider({
	slidesWidth: computed (() => preparedSlides.value.map(s => s.width)),
	viewportWidth,
	isMobile,
});

</script>

<template>
	<div ref="viewport" :class="classes.root">
		<div :class="classes.container">
			<header-desktop v-if="!isMobile" />
			<section-slider
				:slides="preparedSlides"
				:track-style="trackStyle"
				:can-next="canNext"
				:can-prev="canPrev"
				@go-to="goTo"
				@prev="prev"
				@next="next"
				@wheel="pointerState.onWheel"
				@pointer-down="pointerState.onPointerDown"
				@pointer-move="pointerState.onPointerMove"
				@pointer-up="pointerState.onPointerUp"
				@touch-start="pointerState.onTouchStart"
				@touch-move="pointerState.onTouchMove"
				@touch-end="pointerState.onTouchEnd"
			/>
		</div>
		<pagination-mobile
			v-if="isMobile"
			:can-next="canNext"
			:can-prev="canPrev"
			:current-index="currentIndex"
			:total-slides="preparedSlides.length"
			@go-to="goTo"
			@prev="prev"
			@next="next"
		/>
		<header-mobile v-if="isMobile" @close="emits('close')" />
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
}

.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	margin: 8px 0;
	overflow-x: hidden;
	background: linear-gradient(140deg, rgb(17 17 19 / 80%) 22.94%, rgb(10 10 10 / 80%) 94.93%);
	border: 1px solid #1d1d1e;
	border-radius: 18px;
}

@media (max-width: 768px) {
	.container {
		border-radius: 34px;
	}
}
 </style>

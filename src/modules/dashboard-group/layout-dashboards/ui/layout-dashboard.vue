<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { computed, useCssModule, useTemplateRef, watch } from 'vue';

import { useDashboardLayout, useSlider } from '../composables';

import HeaderDesktop from './header-desktop.vue';
import HeaderMobile from './header-mobile.vue';
import SectionSlider from './section-slider.vue';
import PaginationMobile from './pagination-mobile.vue';

const emits = defineEmits<{
	(e: 'close'): void;
}>();

const { sections, tabs } = useDashboardLayout();

const { width } = useElementSize(useTemplateRef('viewport'));

const viewportWidth = computed(() => width.value);

const isMobile = computed(() => viewportWidth.value < 768 - 72*2);
const isSectionWidthLessThanViewport = computed(() =>
	sections.value.reduce((acc, s) => acc + s.width, 0) < viewportWidth.value,
);

const normalizeWidth = computed(() => viewportWidth.value / sections.value.length);

const preparedSlides = computed(
	() => sections.value
		.map(s => ({
			...s,
			width: isMobile.value
				? viewportWidth.value
				: isSectionWidthLessThanViewport.value
					? normalizeWidth.value
					: s.width,
		})),
);

const {
	translateX,
	trackStyle,
	pointerState,
	canNext,
	canPrev,
	currentIndex,
	next,
	prev,
	goTo,
	isDragging,
} = useSlider({
	slidesWidth: computed (() => preparedSlides.value.map(s => s.width)),
	viewportWidth,
	gap: 23,
	isMobile,
});

const classes = useCssModule('classes');

watch(
	isDragging,
	() => {
		if (isDragging.value) {
			document.body.classList.add(classes['no-select']);
		} else {
			document.body.classList.remove(classes['no-select']);
		}
	},
);

</script>

<template>
	<div ref="viewport" :class="classes.root">
		<div :class="classes.container">
			<header-desktop
				v-if="!isMobile"
				:tabs="tabs"
			/>
			<section-slider
				:slides="preparedSlides"
				:track-style="trackStyle"
				:can-next="canNext"
				:can-prev="canPrev"
				:translate-x="translateX"
				:viewport-width="viewportWidth"
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
				@update-section="sections = $event"
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
		<header-mobile
			v-if="isMobile"
			:tabs="tabs"
			@close="emits('close')"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	overflow-x: hidden;
}

.container {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	margin: 8px 0;
	overflow: hidden;
	border: 1px solid #1d1d1e;
	border-radius: 18px;
}

@media (max-width: 768px) {
	.container {
		border-radius: 34px;
	}
}

.no-select {
	user-select: none !important;
}
 </style>

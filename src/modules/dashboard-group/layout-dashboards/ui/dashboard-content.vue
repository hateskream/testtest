<script setup lang="ts">
import { useElementSize } from '@vueuse/core';
import { computed, ref, useTemplateRef } from 'vue';

import { createDashboardContext, useDashboard, useSlider } from '../composables';

import PaginationMobile from './pagination-mobile.vue';
import SectionSlider from './section-slider.vue';
import DashboardContentLoader from './dashboard-content-loader.vue';
import DashboardContentError from './dashboard-content-error.vue';

interface IDashboardContentProps {
	dashboardId: string;
	isMobile: boolean;
}

const props = defineProps<IDashboardContentProps>();

const {
	sections,
	isLoading,
	isError,
	refetch,
	setWidgetStateType,
	changeWidthSection,
	changeHeightWidget,
	changeMaxCountRowWidget,
	changeOrderWidgetsInSection,
	changeOrderSections,
	updateWidgetState,
} = useDashboard(props.dashboardId);

createDashboardContext({
	updateWidgetState,
	setWidgetStateType,
	changeHeightWidget,
	changeMaxCountRowWidget,
	changeWidthSection,
	changeOrderWidgetsInSection,
	changeOrderSections,
});

const viewportRef = useTemplateRef('viewport');
const { width: viewportWidth } = useElementSize(viewportRef);

const isSectionWidthLessThanViewport = computed(() =>
	sections.value.reduce((acc, s) => acc + s.width, 0) < viewportWidth.value,
);

const normalizeWidth = computed(() => viewportWidth.value / sections.value.length);

const preparedSlides = computed(() => {
	if (props.isMobile) {
		return sections.value.map(s => ({ ...s, width: viewportWidth.value }));
	}

	if (isSectionWidthLessThanViewport.value) {
		return sections.value.map(s => ({ ...s, width: normalizeWidth.value }));
	}

	return sections.value;
});

const sliderRef = ref<typeof SectionSlider | null>(null);

const {
	translateX,
	canNext,
	canPrev,
	currentIndex,
	next,
	prev,
	goTo,
	visibleSlidesCount,
} = useSlider({
	slidesWidth: computed(() => preparedSlides.value.map(s => s.width)),
	viewportWidth,
	gap: 23,
	isMobile: computed(() => props.isMobile),
	container: computed(() => sliderRef.value?.trackRef),
});
</script>

<template>
	<div ref="viewport" :class="classes.content">
		<dashboard-content-loader v-if="isLoading" />
		<dashboard-content-error v-else-if="isError" @retry="refetch" />
		<section-slider
			v-else
			ref="sliderRef"
			:slides="preparedSlides"
			:can-next="canNext"
			:can-prev="canPrev"
			:translate-x="translateX"
			:current-index="currentIndex"
			:visible-slides-count="visibleSlidesCount"
			:go-to="goTo"
			@prev="prev"
			@next="next"
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
</template>

<style module="classes">
.content {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
	overflow: hidden;
}
</style>

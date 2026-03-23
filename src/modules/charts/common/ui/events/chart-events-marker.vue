<script setup lang="ts">
import { computed, useId } from 'vue';

import { IconIds } from '@/shared/ui/icon';

interface IProps {
	imageUrl?: string | null;
	size?: number;
	segmentsCount: number;
	title?: string;
	segmentColor?: string;
	segmentWidth?: number;
}

const props = withDefaults(defineProps<IProps>(), {
	segmentColor: 'var(--success-success-00, #04eda0)',
	segmentWidth: 2,
	size: 32,
	title: '',
	imageUrl: null,
});

const MAX_SEGMENTS_COUNT = 10;

const imageClipPathId = computed(() => `clip-img-${useId()}`);

const sizeInPx = computed(() => props.size + 'px');
const imageSize = computed(( ) => props.size - props.segmentWidth - 2);
const segmentsRadius = computed(() => 16 - props.segmentWidth);

const preparedSegmentsCount = computed(() => props.segmentsCount > MAX_SEGMENTS_COUNT ? 1 : props.segmentsCount);

const GAP_RATIO = 0.2; // доля окружности, занимаемая суммарными зазорами между сегментами (0..1)

const circumference = computed(() => 2 * Math.PI * segmentsRadius.value);

const segmentSize = computed(() => (circumference.value * (1 - GAP_RATIO)) / preparedSegmentsCount.value);
const gapSize = computed(() => circumference.value * GAP_RATIO / preparedSegmentsCount.value);

const segmentsDasharray = computed(() => {
	if (preparedSegmentsCount.value > 1) {
		return `${segmentSize.value} ${gapSize.value}`;
	}

	return undefined;
});

const segmentsDashoffset = computed(() => {
	const usedSize = (gapSize.value + segmentSize.value) * preparedSegmentsCount.value;
	const leftOver = circumference.value - usedSize;

	return -leftOver / 2;
});

const iconHref = computed(() => `#icon-${IconIds.Deals}`);
</script>

<template>
	<div
		:title="props.title"
		:class="classes.marker"
		role="button"
	>
		<svg
			:width="size"
			:height="size"
			:class="classes.svgMarker"
			viewBox="0 0 32 32"
			aria-hidden="true"
		>
			<circle
				:class="classes.segments"
				cx="16"
				cy="16"
				:r="segmentsRadius"
				:stroke-width="props.segmentWidth"
				:stroke="props.segmentColor"
				:stroke-dasharray="segmentsDasharray"
				:stroke-dashoffset="segmentsDashoffset"
				fill="none"
				stroke-linecap="butt"
			/>
			<defs>
				<clipPath :id="imageClipPathId">
					<circle
						cx="16"
						cy="16"
						r="12"
					></circle>
				</clipPath>
			</defs>
			<image
				v-if="props.imageUrl"
				:href="props.imageUrl"
				x="2"
				y="2"
				:width="imageSize"
				:height="imageSize"
				:clip-path="`url(#${imageClipPathId})`"
			/>
			<use
				v-else
				:xlink:href="iconHref"
				height="20"
				width="20"
				x="6"
				y="6"
			/>
		</svg>
	</div>
</template>

<style module="classes">
.marker {
	display: flex;
	justify-content: center;
	align-items: center;
	width: v-bind(sizeInPx);
	height: v-bind(sizeInPx);
	transform: translateZ(0);
	cursor: pointer;
	user-select: none;
	touch-action: manipulation;
}

.svgMarker {
	display: block;
}

.segments {
	transform: rotate(-120deg);
	transform-origin: 50% 50%;
}
</style>

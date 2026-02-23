<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';

import { degreeToRadians } from '@/shared/lib';
import type { ISpeedometerSegment } from './types';
import { UiSpeedometerCircle } from './circle';

import UiSpeedometerArrow from './ui-speedometer-arrow.vue';

interface ISpeedometerProps {
	value: number;
	color: CSSProperties['color'];
	shadowColor?: CSSProperties['color'];
	segments: readonly ISpeedometerSegment[];
	showBlur?: boolean;
	width?: number;
	height?: number;
}

const props = withDefaults(defineProps<ISpeedometerProps>(), {
	width: 260,
	height: 155,
	shadowColor: undefined,
});

const widthInPx = computed(() => `${props.width}px`);
const heightInPx = computed(() => `${props.height}px`);

const range = computed(() => {
	if (props.segments.length === 0) {
		return {
			from: 0,
			to: 0,
		};
	}

	const segmentIndex = Math.max(0, props.segments.findIndex(segment => props.value <= segment.max));

	if (segmentIndex < props.segments.length - 1 && props.segments.length !== 1) {
		return {
			from: props.segments[segmentIndex].position,
			to: props.segments[segmentIndex + 1].position,
		};
	}

	return {
		from: props.segments[segmentIndex].position,
		to: 100,
	};
});

const arrowRotate = computed(() => (Math.max(0, Math.min(props.value, 100)) / 100) * 180);

const startAngle = computed(() => degreeToRadians(180 + 180 * (range.value.from / 100)));
const endAngle = computed(() => degreeToRadians(180 + 180 * (range.value.to / 100)));
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.chart">
			<ui-speedometer-circle
				:width="widthInPx"
				:class="classes.svg"
				:color="props.color"
				:shadow-color="props.shadowColor ?? props.color"
				:start="startAngle"
				:end="endAngle"
				:show-blur="props.showBlur"
			/>
			<ui-speedometer-arrow
				:width="widthInPx"
				:rotate="arrowRotate"
				:class="classes.svg"
			/>
		</div>
		<slot />
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	align-items: center;
}

.chart {
	position: relative;
	width: v-bind(widthInPx);
	height: v-bind(heightInPx);
	overflow: hidden;
}

.svg {
	position: absolute;
	top: 0;
	left: 0;
}
</style>

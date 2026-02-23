<script setup lang="ts">
import { type CSSProperties } from 'vue';

import UiSpeedometerCircleBase from './ui-speedometer-circle-base.vue';
import UiSpeedometerCircleBlur from './ui-speedometer-circle-blur.vue';
import UiSpeedometerCircleSegment from './ui-speedometer-circle-segment.vue';

interface ISpeedometerCircleProps {
	color: CSSProperties['color'];
	shadowColor: CSSProperties['color'];
	start: number;
	end: number;
	showBlur?: boolean;
}

const props = defineProps<ISpeedometerCircleProps>();

const CIRCLE_RADIUS = 68.5;
const CIRCLE_CENTER = 98.5;
const BLUR_SIZE = 30;
</script>

<template>
	<svg viewBox="0 0 197 197">
		<ui-speedometer-circle-base
			width="137"
			height="137"
			x="30"
			y="30"
		/>
		<ui-speedometer-circle-blur
			width="173"
			height="173"
			x="12"
			y="12"
		/>
		<ui-speedometer-circle-segment
			:color="props.color"
			:shadow-color="props.shadowColor"
			:start="props.start"
			:end="props.end"
			:blur-size="BLUR_SIZE"
			:show-blur="props.showBlur"
			:radius="CIRCLE_RADIUS"
			:center="CIRCLE_CENTER"
		/>
	</svg>
</template>

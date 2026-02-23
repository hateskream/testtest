<script setup lang="ts">
import { computed, type CSSProperties, useId } from 'vue';

import { createAnnularSectorPath, createCircularArcPath } from '@/shared/lib';

interface ISpeedometerSegmentProps {
	color: CSSProperties['color'];
	shadowColor: CSSProperties['color'];
	start: number;
	end: number;
	showBlur?: boolean;
	blurSize?: number;
	radius: number;
	center: number;
}

const props = withDefaults(defineProps<ISpeedometerSegmentProps>(), {
	blurSize: 30,
});

const preparedLinePath = computed(() => {
	return createCircularArcPath({
		cx: props.center,
		cy: props.center,
		r: props.radius,
		from: props.start,
		to: props.end,
	});
});

const preparedBlurPath = computed(() => {
	return createAnnularSectorPath({
		cx: props.center,
		cy: props.center,
		// radius - 1, чтобы точно не было проблем с границами line и blur
		r: props.radius - 1,
		R: props.radius + props.blurSize,
		from: props.start,
		to: props.end,
	});
});

const id = useId();

const firstGradientId = `${id}-gradient-1`;
const secondGradientId = `${id}-gradient-2`;
</script>

<template>
	<g>
		<g v-if="props.showBlur">
			<path
				:fill="`url(#${firstGradientId})`"
				fill-opacity=".2"
				:d="preparedBlurPath"
			/>
			<path
				:fill="`url(#${secondGradientId})`"
				fill-opacity=".2"
				:d="preparedBlurPath"
			/>
			<defs>
				<radialGradient
					:id="firstGradientId"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="rotate(179.709 49.125 49.375)scale(98.5013)"
				>
					<stop
						offset=".699"
						stop-color="#fff"
						stop-opacity=".5"
					/>
					<stop
						offset="1"
						stop-color="#fff"
						stop-opacity="0"
					/>
				</radialGradient>
				<radialGradient
					:id="secondGradientId"
					cx="0"
					cy="0"
					r="1"
					gradientUnits="userSpaceOnUse"
					gradientTransform="rotate(179.709 49.125 49.375)scale(98.5013)"
				>
					<stop
						offset=".707"
						stop-color="#fff"
						stop-opacity=".5"
					/>
					<stop
						offset="1"
						stop-color="#0c0c0d"
						stop-opacity="0"
					/>
				</radialGradient>
			</defs>
		</g>
		<path
			stroke-width="4"
			stroke-linecap="round"
			fill="none"
			:d="preparedLinePath"
			:stroke="props.color"
			:class="classes.segment"
		/>
	</g>
</template>

<style module="classes">
.segment {
	filter:
		drop-shadow(0 0 5px v-bind(shadowColor))
		drop-shadow(0 0 10px v-bind(shadowColor));
}
</style>

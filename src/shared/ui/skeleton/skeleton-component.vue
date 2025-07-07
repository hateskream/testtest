<script setup lang="ts">
import type { CSSProperties } from 'vue';
import { computed, useCssModule } from 'vue';

interface IUiSkeletonProps {
	width?: string;
	height?: CSSProperties['height'];
	shape?: 'circle' | 'rectangle';
	size?: string | null;
	borderRadius?: CSSProperties['borderRadius'];
	animation?: 'wave' | 'none';
	opacity?: number;
}

const props = withDefaults(defineProps<IUiSkeletonProps>(), {
	width: '100%',
	height: '22px',
	shape: 'rectangle',
	size: null,
	borderRadius: '6px',
	animation: 'wave',
	opacity: 1,
});

const classes = useCssModule('classes');

const containerStyle = computed(() => {
	const baseStyle = {
		borderRadius: props.shape === 'circle' ? '50%' : props.borderRadius,
		backgroundColor: 'rgba(255, 255, 255, 0.1)',
		opacity: props.opacity,
	};

	if (props.size) {
		return {
			...baseStyle,
			width: props.size,
			height: props.size,
		};
	}

	return {
		...baseStyle,
		width: props.width,
		height: props.height,
	};
});

const animation = computed(() => (props.animation === 'wave' ? classes['skeleton--wave'] : 'none'));
</script>

<template>
	<div
		:class="[animation, classes.skeleton]"
		:style="containerStyle"
	/>
</template>

<style module="classes">
.skeleton {
	position: relative;
	display: inline-block;
	overflow: hidden;
}

.skeleton--wave::before {
	content: '';
	position: absolute;
	top: 0;
	left: -100%;
	width: 100%;
	height: 100%;
	/* stylelint-disable-next-line declaration-colon-newline-after */
	background: linear-gradient(
		90deg,
		transparent 0%,
		rgb(255 255 255 / 10%) 50%,
		transparent 100%
	);
	animation: wave 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes wave {
	0% {
		left: -100%;
	}

	50% {
		left: 100%;
	}

	100% {
		left: 100%;
	}
}
</style>

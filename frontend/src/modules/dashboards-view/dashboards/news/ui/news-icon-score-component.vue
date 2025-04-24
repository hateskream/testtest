<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { IconIds, UiIcon } from '@/shared/ui/icon';

interface INewsIconScoreComponentProps {
	score: number;
}

const props = defineProps<INewsIconScoreComponentProps>();

const classes = useCssModule('classes');

const MEDIUM_RANGE = { min: 41, max: 59 };
const BARS_COUNT = 3;
const RANGE_SIZE = 40; // 0-40 for low, 60-100 for high
const BAR_STEP = RANGE_SIZE / BARS_COUNT;

const iconData = computed(() => {
	// Medium case - use separate icon
	if (props.score >= MEDIUM_RANGE.min && props.score <= MEDIUM_RANGE.max) {
		return {
			isMedium: true,
			colorClass: classes.iconScoreMedium,
			filledBars: 0,
		};
	}

	const isHigh = props.score > MEDIUM_RANGE.max;
	const scoreInRange = isHigh ? props.score - 60 : props.score;
	const filledBars = Math.min(Math.floor(scoreInRange / BAR_STEP) + 1, BARS_COUNT);

	return {
		isMedium: false,
		colorClass: isHigh ? classes.iconScoreHigh : classes.iconScoreLow,
		filledBars,
	};
});
</script>

<template>
	<div :class="classes.newsScore">
		<template v-if="iconData.isMedium">
			<ui-icon
				:id="IconIds.ScoreMedium"
				:class="classes.iconScoreMedium"
			/>
		</template>
		<template v-else>
			<svg
				width="22"
				height="22"
				viewBox="0 0 22 22"
				xmlns="http://www.w3.org/2000/svg"
				:class="[iconData.colorClass, classes.icon]"
			>
				<rect
					x="6.75"
					y="12"
					width="5"
					height="2.5"
					rx="1.25"
					transform="rotate(90 6.75 12)"
					:opacity="iconData.filledBars >= 1 ? 1 : 0.2"
				/>
				<rect
					x="12.25"
					y="8"
					width="9"
					height="2.5"
					rx="1.25"
					transform="rotate(90 12.25 8)"
					:opacity="iconData.filledBars >= 2 ? 1 : 0.2"
				/>
				<rect
					x="17.75"
					y="5"
					width="12"
					height="2.5"
					rx="1.25"
					transform="rotate(90 17.75 5)"
					:opacity="iconData.filledBars >= 3 ? 1 : 0.2"
				/>
			</svg>
		</template>
	</div>
</template>

<style module="classes">
.icon {
	width: 1em;
	height: 1em;
	overflow: hidden;
	fill: currentcolor;
}

.iconScoreLow {
	width: 16px;
	height: 12px;
	color: var(--bg-color-negative-500);
	transform: rotateX(180deg);
}

.iconScoreHigh {
	width: 16px;
	height: 12px;
	color: var(--bg-color-positive-500);
}

.iconScoreMedium {
	width: 10px;
	height: 13px;
	color: rgb(217 217 217 / 100%);
}

.newsScore {
	position: absolute;
	top: 0;
	right: 0;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 22px;
	height: 22px;
	background-color: var(--bg-color-base-100);
	border-radius: 8px;
}
</style>

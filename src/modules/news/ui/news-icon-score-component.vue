<script setup lang="ts">
import { computed, useCssModule } from 'vue';

import { Score, type ScoreType, Sentiment, type SentimentType } from '../model';

interface INewsIconScoreComponentProps {
	score: ScoreType;
	tone: SentimentType;
}

const props = defineProps<INewsIconScoreComponentProps>();

const classes = useCssModule('classes');

const toneColorClass = computed(() => ({
	[Sentiment.Optimistic]: classes.toneOptimistic,
	[Sentiment.Neutral]: classes.toneNeutral,
	[Sentiment.Pessimistic]: classes.tonePessimistic,
}[props.tone]));

const filledBars = computed(() => ({
	[Score.Low]: 1,
	[Score.Medium]: 2,
	[Score.High]: 3,
}[props.score]));
</script>

<template>
	<div :class="classes.newsScore">
		<svg
			width="22"
			height="22"
			viewBox="0 0 22 22"
			xmlns="http://www.w3.org/2000/svg"
			:class="[toneColorClass, classes.icon]"
		>
			<rect
				x="6.75"
				y="12"
				width="5"
				height="2.5"
				rx="1.25"
				transform="rotate(90 6.75 12)"
				:opacity="filledBars >= 1 ? 1 : 0.2"
			/>
			<rect
				x="12.25"
				y="8"
				width="9"
				height="2.5"
				rx="1.25"
				transform="rotate(90 12.25 8)"
				:opacity="filledBars >= 2 ? 1 : 0.2"
			/>
			<rect
				x="17.75"
				y="5"
				width="12"
				height="2.5"
				rx="1.25"
				transform="rotate(90 17.75 5)"
				:opacity="filledBars >= 3 ? 1 : 0.2"
			/>
		</svg>
	</div>
</template>

<style module="classes">
.icon {
	width: 22px;
	height: 22px;
	overflow: hidden;
	fill: currentcolor;
}

.toneOptimistic {
	color: var(--atom-success-00, #04eda0);
}

.tonePessimistic {
	color: var(--bg-color-negative-500);
}

.toneNeutral {
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
	border-radius: 8px;
}
</style>

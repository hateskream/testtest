<script setup lang="ts">
import { computed } from 'vue';

import type { ITableScheduleCell } from '../model';

interface IProps {
	data: ITableScheduleCell;
}

const props = defineProps<IProps>();

const timeToMinutes = (time: string): number => {
	const [hours, minutes] = time.split(':').map(Number);
	return hours * 60 + minutes;
};

const formatTime = (time: string): string => {
	return time;
};

const startMinutes = computed(() => timeToMinutes(props.data.start));
const finishMinutes = computed(() => timeToMinutes(props.data.finish));
const currentMinutes = computed(() => timeToMinutes(props.data.current));

const isOvernight = computed(() => startMinutes.value > finishMinutes.value);

const startPercent = computed(() => (startMinutes.value / 1440) * 100);
const finishPercent = computed(() => (finishMinutes.value / 1440) * 100);
const currentPercent = computed(() => (currentMinutes.value / 1440) * 100);


const durationMinutes = computed(() => {
	if (isOvernight.value) {
		return (1440 - startMinutes.value) + finishMinutes.value;
	} else {
		return finishMinutes.value - startMinutes.value;
	}
});


const shouldMergeLabels = computed(() => {
	const reverseDuration = 1440 - durationMinutes.value;
	const minDistance = Math.min(durationMinutes.value, reverseDuration);
	return minDistance < 360;
});


const centerPercent = computed(() => {
	const reverseDuration = 1440 - durationMinutes.value;
	if (reverseDuration < durationMinutes.value) {
		const centerMinutes = finishMinutes.value + reverseDuration / 2;
		return (centerMinutes / 1440) * 100;
	}
	if (isOvernight.value) {
		const halfDuration = durationMinutes.value / 2;
		const centerMinutes = (startMinutes.value + halfDuration) % 1440;
		return (centerMinutes / 1440) * 100;
	} else {
		return (startPercent.value + finishPercent.value) / 2;
	}
});


const mergedLabel = computed(() => `${formatTime(props.data.start)} - ${formatTime(props.data.finish)}`);

const filledSegments = computed(() => {
	if (isOvernight.value) {
		return [
			{
				left: `${startPercent.value}%`,
				width: `${100 - startPercent.value}%`,
			},
			{
				left: '0%',
				width: `${finishPercent.value}%`,
			},
		];
	} else {
		return [
			{
				left: `${startPercent.value}%`,
				width: `${finishPercent.value - startPercent.value}%`,
			},
		];
	}
});
</script>

<template>
	<div :class="classes.chartContainer">
		<div :class="classes.timelineWrapper">
			<div :class="classes.timeLabelsContainer" class="text-300-r">
				<template v-if="shouldMergeLabels">
					<span
						:class="[classes.timeLabel, classes.timeLabelMerged]"
						:style="{ left: `${centerPercent}%` }"
					>
						{{ mergedLabel }}
					</span>
				</template>
				<template v-else>
					<span
						:class="[classes.timeLabel, classes.timeLabelStart]"
						:style="{ left: `${startPercent}%` }"
					>
						{{ formatTime(data.start) }}
					</span>
					<span
						:class="[classes.timeLabel, classes.timeLabelFinish]"
						:style="{ left: `${finishPercent}%` }"
					>
						{{ formatTime(data.finish) }}
					</span>
				</template>
			</div>

			<div :class="classes.timeline">
				<div :class="classes.timelineBackground"></div>

				<div
					v-for="(segment, index) in filledSegments"
					:key="index"
					:class="classes.filledSegment"
					:style="{
						left: segment.left,
						width: segment.width
					}"
				></div>

				<div
					:class="classes.currentMarker"
					:style="{ left: `${currentPercent}%` }"
				></div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.chartContainer {
	display: flex;
	width: 100%;
	height: 32px;
}

.timelineWrapper {
	position: relative;
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 4px;
}

.timeLabelsContainer {
	position: relative;
	width: 100%;
	height: 18px;
}

.timeLabel {
	position: absolute;
	top: 0;
	color: var(--text-color-base-500, #ffffff);
	white-space: nowrap;
	transform: translateX(-50%);
}

.timeLabelStart {
	z-index: 2;
	background: transparent;
}

.timeLabelFinish {
	z-index: 1;
	background: transparent;
}

.timeLabelMerged {
	z-index: 2;
	background: transparent;
}

.timeline {
	position: relative;
	width: 100%;
	height: 8px;
}

.timelineBackground {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: #2a2a2a;
	border-radius: 4px;
}

.filledSegment {
	position: absolute;
	top: 0;
	height: 100%;
	background-color: var(--metrics-color-positive);
	border-radius: 4px;
}

.currentMarker {
	position: absolute;
	top: -2px;
	z-index: 1;
	width: 3px;
	height: calc(100% + 4px);
	background-color: #ffffff;
	border: 1px solid var(--border-color-contrast-300);
	transform: translateX(-50%);
}
</style>

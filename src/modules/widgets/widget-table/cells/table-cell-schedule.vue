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
		// Один сегмент от start до finish
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
		{{props}}
<!--		<span :class="classes.timeLabel">{{ formatTime(data.start) }}</span>-->
<!--		<span :class="classes.timeLabel">{{ formatTime(data.finish) }}</span>-->

<!--		<div :class="classes.timeline">-->

<!--			<div :class="classes.timelineBackground"></div>-->


<!--			<div-->
<!--				v-for="(segment, index) in filledSegments"-->
<!--				:key="index"-->
<!--				:class="classes.filledSegment"-->
<!--				:style="{-->
<!--					left: segment.left,-->
<!--					width: segment.width-->
<!--				}"-->
<!--			></div>-->


<!--			<div-->
<!--				:class="classes.currentMarker"-->
<!--				:style="{ left: `${currentPercent}%` }"-->
<!--			></div>-->
<!--		</div>-->
	</div>
</template>

<style module="classes">
.chartContainer {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	gap: 8px;
	width: 100%;
	height: 32px;
}

.timeLabel {
	font-size: 14px;
	color: var(--text-color-base-300, #fff);
	white-space: nowrap;
}

.timeline {
	position: relative;
	flex: 1;
	height: 8px;
	min-width: 100px;
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
	background-color: #00d9c0;
	border-radius: 4px;
}

.currentMarker {
	position: absolute;
	top: -2px;
	height: calc(100% + 4px);
	width: 2px;
	background-color: #ffffff;
	transform: translateX(-50%);
	z-index: 1;
}
</style>

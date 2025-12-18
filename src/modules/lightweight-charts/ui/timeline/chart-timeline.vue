<script setup lang="ts">

import { computed, useTemplateRef } from 'vue';
import { useElementSize, useNow } from '@vueuse/core';

import type { IChartTimelineSegment } from '../../model/chart-timeline.ts';
import { getDateFormatter, getTimezoneOffset, toTime } from '@/shared/lib';
import { UiText } from '@/shared/ui/text';

import ChartTimelineDelimiter from './chart-timeline-delimiter.vue';
import ChartTimelineSegment from './chart-timeline-segment.vue';

interface IProps {
	segments: IChartTimelineSegment[];
	startTime: number;
	endTime: number;
}

const props = defineProps<IProps>();

const START_OFFSET_PX = 70;
const END_OFFSET_PX = 20;

const timezone = defineModel<string>('timezone', { default: getTimezoneOffset() });

const { width: timelineWidth } = useElementSize(useTemplateRef('timeline'));

const originalTimePerPixel = computed(() => (props.endTime - props.startTime) / timelineWidth.value);

const startTimeOffset = computed(() => originalTimePerPixel.value * START_OFFSET_PX);
const endTimeOffset = computed(() => originalTimePerPixel.value * END_OFFSET_PX);

// segments

const preparedStartTime = computed(() => props.startTime - startTimeOffset.value);
const preparedEndTime = computed(() => props.endTime + endTimeOffset.value);

const totalTime = computed(() => preparedEndTime.value - preparedStartTime.value);

type PreparedSegment = IChartTimelineSegment & { width: number; label: string };

const preparedSegments = computed(() => {
	return props.segments.map(segment => ({
		...segment,
		width: (segment.to - segment.from) / totalTime.value * 100,
		label: `${segment.title}, ${toTime(segment.from)} - ${toTime(segment.to)}`,
	} as PreparedSegment));
});

function prepareTime(time: number) {
	return Math.round(time / 1000 / 60);
}

const beforeSegmentWidth = computed(() => {
	if (!props.segments.length) {
		return 100;
	}

	const [firstSegment] = props.segments;

	if (prepareTime(firstSegment.from) > prepareTime(preparedStartTime.value)) {
		return (firstSegment.from - preparedStartTime.value) / totalTime.value * 100;
	}

	return null;
});

const segmentLabelDateFormatter = getDateFormatter({ day: '2-digit', weekday: 'short' });

const beforeSegmentLabel = computed(() => {
	const time = props.segments[0].from;

	return segmentLabelDateFormatter.format(new Date(time));
});

const afterSegmentWidth = computed(() => {
	if (!props.segments.length) {
		return null;
	}

	const lastSegment = props.segments[props.segments.length - 1];

	if (prepareTime(lastSegment.to) < prepareTime(preparedEndTime.value)) {
		return (preparedEndTime.value - lastSegment.to) / totalTime.value * 100;
	}

	return null;
});

const afterSegmentLabel = computed(() => {
	const time = props.segments[props.segments.length - 1].to + 1;

	return segmentLabelDateFormatter.format(new Date(time));
});

// now label

const now = useNow({ interval: 1000 * 60 });

const currentLabel = computed(() => toTime(now.value));
const currentPercent = computed(() => (now.value.getTime() - preparedStartTime.value) / totalTime.value * 100);
</script>

<template>
	<div ref="timeline" :class="classes.timeline">
		<ui-text
			:class="classes.timezone"
			token="text-100-r"
			as="div"
		>
			UTC{{ timezone }}
		</ui-text>
		<div v-if="timelineWidth" :class="classes.timelineSegments">
			<template v-if="beforeSegmentWidth">
				<chart-timeline-segment :width="beforeSegmentWidth + '%'" />
				<chart-timeline-delimiter v-if="preparedSegments.length > 0" :label="beforeSegmentLabel" />
			</template>
			<template
				v-for="(segment, key) in preparedSegments"
				:key="segment.from"
			>
				<chart-timeline-segment
					:width="segment.width + '%'"
					:title="segment.label"
					:color="segment.color"
				/>
				<chart-timeline-delimiter
					v-if="key !== segments.length - 1"
					:label="toTime(segment.to)"
				/>
			</template>
			<template v-if="afterSegmentWidth">
				<chart-timeline-delimiter :label="afterSegmentLabel" />
				<chart-timeline-segment :width="afterSegmentWidth + '%'" />
			</template>
			<chart-timeline-delimiter
				v-if="currentPercent"
				:class="classes.current"
				:style="{ left: currentPercent + '%' }"
				:label="currentLabel"
				color="var(--contrast-contrast-00, #ffffff)"
				label-color="var(--text-500, rgb(255 255 255 / 96%))"
			/>
		</div>
	</div>
</template>

<style module="classes">
.timeline {
	position: relative;
	display: flex;
	flex-shrink: 0;
	width: 100%;
	height: 36px;
}

.timezone {
	position: absolute;
	top: 0;
	left: 0;
	color: var(--text-100, rgb(255 255 255 / 30%));
}

.timelineSegments {
	position: relative;
	display: flex;
	align-items: flex-end;
	gap: 2px;
	width: 100%;
}

.current {
	position: absolute;
	bottom: 0;
	width: 3px;
	border: 1px solid var(--surface-01, rgb(17 17 19 / 92%));
	border-radius: var(--radius-full, 9999px);
}
</style>

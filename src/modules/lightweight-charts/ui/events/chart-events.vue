<script setup lang="ts">

import { computed, useTemplateRef } from 'vue';
import { useElementSize } from '@vueuse/core';

import { UiPosition } from '@/shared/ui/position';
import { ModalBadgeList } from '@/modules/widgets/base';
import type { ICalendarEvent } from '@/modules/calendar';

import ChartEventsMarker from './chart-events-marker.vue';
import ChartEventsCard from './chart-events-card.vue';

interface IProps {
	events: ICalendarEvent[];
	startTime: number;
	endTime: number;
}

const props = withDefaults(defineProps<IProps>(), {});

const { width: rowElementWidth } = useElementSize(useTemplateRef('row'));

const mergeThresholdPx = 32;
const mergeThresholdTime = computed(() => mergeThresholdPx * (props.endTime - props.startTime) / rowElementWidth.value);

type StackedEvents = Map<number, ICalendarEvent[]>;

const stackedEvents = computed(() => {
	const stacks = new Map<number, ICalendarEvent[]>() as StackedEvents;
	let currentStack: ICalendarEvent[] = [];
	let currentStackEventTime: number;

	for (const event of props.events) {
		if (!event.eventDatetime) {
			continue;
		}

		const eventTime = Date.parse(event.eventDatetime);

		if (eventTime < props.startTime || eventTime > props.endTime) {
			continue;
		}

		if (currentStack.length === 0) {
			currentStack.push(event);
			currentStackEventTime = Date.parse(event.eventDatetime);
			continue;
		}

		if (eventTime - currentStackEventTime! <= mergeThresholdTime.value) {
			currentStack.push(event);
		} else {
			stacks.set(currentStackEventTime!, currentStack);
			currentStack = [event];
			currentStackEventTime = eventTime;
		}
	}

	if (currentStack.length > 0) {
		stacks.set(currentStackEventTime!, currentStack);
	}

	return stacks;
});

const preparedOffsets = computed(() => {
	return Object.fromEntries(Array.from(stackedEvents.value.keys()).map(key => {
		return [
			key,
			(key - props.startTime) / (props.endTime - props.startTime) * 100,
		];
	}));
});
</script>

<template>
	<div ref="row" :class="classes.container">
		<div :class="classes.row">
			<ui-position
				v-for="([time, stack]) in stackedEvents"
				:key="time"
				placement="top"
				trigger="click"
				:class="classes.point"
				:style="{
					left: `${preparedOffsets[time]}%`
				}"
			>
				<template #title>
					<chart-events-marker
						:segments-count="stack.length"
						:title="`${stack.length} event(s)`"
						:image-url="stack[0].imageUrl"
					/>
				</template>
				<template #content>
					<modal-badge-list display-variant="default">
						<template #title>Related events</template>
						<template #default>
							<div :class="classes.scrollable">
								<chart-events-card
									v-for="event in stack"
									:key="event.id"
									:title="event.eventTitle"
									:datetime="(event.eventDatetime)!"
									:metrics="event.metrics"
									:class="classes.card"
								/>
							</div>
						</template>
					</modal-badge-list>
				</template>
			</ui-position>
		</div>
	</div>
</template>

<style module="classes">
.container {
	display: flex;
	overflow-x: hidden;
}

.row {
	position: relative;
	display: flex;
	width: 100%;
	height: 32px;
}

.point {
	position: absolute;
	transform: translateX(-50%);
}

.scrollable {
	min-height: 0;
	max-height: 400px;
	padding: 0 12px;
	overflow-y: auto;
}

.card {
	padding: 12px 0;
}

.card:not(:last-child) {
	border-bottom: 1px solid rgb(255 255 255 / 12%);
}
</style>

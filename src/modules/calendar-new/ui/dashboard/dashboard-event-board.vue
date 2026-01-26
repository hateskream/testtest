<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef, watch, nextTick } from 'vue';

import type { IEventBoardItem } from '../../model/calendar';
import {
	groupEventsByHour,
	getHourStatus,
	getRelativeLabel,
	findNextEventTime,
	formatEventDay,
} from '../../utils/event-board-utils';
import { UiText } from '@/shared/ui/text';
import { UiClamped } from '@/shared/ui/clamped';

import EventBoardLightning from '../common/event-board-lightning.vue';
import DashboardEventCard from './dashboard-event-card.vue';

const SCROLL_THRESHOLD = 100;

const props = withDefaults(defineProps<{
	eventBoard: IEventBoardItem[];
	favorite?: string[];
	currentTime?: Date;
	isFetchingNext?: boolean;
	isFetchingPrev?: boolean;
}>(), {
	favorite: () => [],
	currentTime: () => new Date(),
});

const emits = defineEmits<{
	loadPrev: [];
	loadNext: [];
}>();

const groupedBoard = computed(() =>
	props.eventBoard.map(day => {
		const grouped = groupEventsByHour(day.events).map(group => {
			const nextEvent = findNextEventTime(group.events, props.currentTime);

			return {
				...group,
				...getHourStatus(day.date, group.hour, props.currentTime),
				expires: nextEvent ? getRelativeLabel(nextEvent.toISOString(), props.currentTime) : null,
				events: group.events.map(event => ({
					...event,
					favorite: props.favorite.includes(event.id),
				})),
			};
		});

		return { ...day, grouped };
	}),
);

const scrollContainer = useTemplateRef('container');
let prevScrollHeight = 0;

watch(() => props.isFetchingPrev, async (isFetching, wasFetching) => {
	const el = scrollContainer.value;

	if (!el) {
		return;
	}

	if (isFetching && !wasFetching) {
		prevScrollHeight = el.scrollHeight;
	}

	if (!isFetching && wasFetching) {
		await nextTick();

		const heightDiff = el.scrollHeight - prevScrollHeight;
		el.scrollTop += heightDiff;
	}
});

function handleScroll() {
	const el = scrollContainer.value;

	if (!el) {
		return;
	}

	if (el.scrollTop <= SCROLL_THRESHOLD && !props.isFetchingPrev) {
		emits('loadPrev');
	}

	if (el.scrollHeight - el.scrollTop - el.clientHeight <= SCROLL_THRESHOLD && !props.isFetchingNext) {
		emits('loadNext');
	}
}

function scrollToNextEvent() {
	const el = scrollContainer.value;

	if (!el) {
		return;
	}

	for (const day of groupedBoard.value) {
		for (const group of day.grouped) {
			if (!group.missed) {
				const section = el.querySelector(`[data-date="${day.date}"] [data-hour="${group.hour}"]`);
				if (section) {
					section.scrollIntoView({ block: 'start' });
					return;
				}
			}
		}
	}

	el.scrollTop = el.scrollHeight;
	emits('loadNext');
}

onMounted(() => {
	scrollToNextEvent();
});
</script>

<template>
	<div
		ref="container"
		:class="classes.eventBoard"
		@scroll.passive="handleScroll"
	>
		<div
			v-for="day in groupedBoard"
			:key="day.date"
			:class="classes.day"
			:data-date="day.date"
		>
			<div :class="classes.date">
				<ui-clamped :rows="1">
					<ui-text token="title-200">
						{{formatEventDay(day.date)}}
					</ui-text>
				</ui-clamped>
			</div>

			<div
				v-for="group in day.grouped"
				:key="group.hour"
				:class="classes.section"
				:data-hour="group.hour"
			>
				<div :class="[classes.hourLabel, { [classes.missed]: group.missed }]">
					<event-board-lightning :soon="group.soon" :favorite="group.events[0].favorite" />

					<ui-text :class="classes.hour" token="text-100-r">
						{{ group.hour }} <span :class="classes.expires">{{group.expires}}</span>
					</ui-text>
				</div>

				<div
					v-for="(event, i) in group.events"
					:key="`${day.date}-${group.hour}-${i}`"
					:class="classes.board"
				>
					<event-board-lightning
						v-if="event.favorite || group.soon"
						:favorite="event.favorite"
					/>

					<dashboard-event-card
						:event="event"
						:is-missed="group.missed"
						:is-favorite="event.favorite"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.eventBoard {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-self: stretch;
	overflow-y: scroll;
	gap: 12px;
	border-radius: 16px;
}

.date {
	position: sticky;
	top: 0;
	z-index: 2;
	display: flex;
	flex: 1 0 0;
	align-items: center;
	align-self: stretch;
	height: var(--height-height-s15, 36px);
	padding-left: var(--padding-padding-s11, 20px);
	color: var(--text-500, rgb(255 255 255 / 96%));
	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
	background: rgb(20 20 21 / 92%);
}

.section {
	position: relative;
}

.hourLabel {
	height: 30px;
	padding: 8px 18px 0;
	text-shadow: 0 4px 4px rgb(0 0 0 / 25%);
	gap: 10px;
}

.missed {
	cursor: default;
	opacity: 0.4;
}

.hour {
	color: var(--text-300, rgb(255 255 255 / 62%));
}

.expires {
	padding-left: 2px;
	color: var(--atom-warning-00, #fc1d4d);
}

.board {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
	padding: 0 4px;
}
</style>

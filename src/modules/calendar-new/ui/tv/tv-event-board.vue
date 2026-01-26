<script setup lang="ts">
import { computed, onMounted, onUnmounted, useTemplateRef, watch, nextTick, ref } from 'vue';

import type { IEventBoardItem } from '../../model/calendar';
import {
	groupEventsByHour,
	getHourStatus,
	formatEventDay,
} from '../../utils/event-board-utils';
import { getHighlightColor } from '../../model/colors';
import { UiText } from '@/shared/ui/text';

import TvEventCard from './tv-event-card.vue';

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
		const grouped = groupEventsByHour(day.events).map(group => ({
			...group,
			...getHourStatus(day.date, group.hour, props.currentTime),
			events: group.events.map(event => ({
				...event,
				favorite: props.favorite.includes(event.id),
			})),
		}));

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

onMounted(() => {
	scrollContainer.value?.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
	scrollContainer.value?.removeEventListener('scroll', handleScroll);
});
</script>

<template>
	<div ref="container" :class="classes.calendarEventBoard">
		<div :class="classes.wrapper">
			<template
				v-for="day in groupedBoard"
				:key="day.date"
			>
				<div
					v-if="day.events.length"
					ref="boards"
					:class="classes.eventSection"
					:data-date="day.date"
				>
					<ui-text token="title-200" :class="classes.boardDate">
						{{ formatEventDay(day.date) }}
					</ui-text>

					<div
						v-for="group in day.grouped"
						:key="group.hour"
						:class="classes.hourSection"
						:data-hour="group.hour"
					>
						<ui-text
							token="text-100-r"
							:class="[classes.hourLabel, classes.lightning, group.missed && classes.missed]"
							:style="getHighlightColor(group.events[0].favorite, group.soon)"
						>
							{{ group.hour }}
						</ui-text>

						<div
							v-for="(event, i) in group.events"
							:key="`${day.date}-${group.hour}-${i}`"
							:class="[
								classes.dayBoard,
								(event.favorite || group.soon) && classes.lightning
							]"
							:style="getHighlightColor(event.favorite, group.soon)"
						>
							<tv-event-card
								:event="event"
								:is-missed="group.missed"
								:is-favorite="event.favorite"
							/>
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<style module="classes">
.calendarEventBoard {
	width: 100%;
	overflow-y: scroll;
}

.eventBoard {
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-self: stretch;
	overflow-y: scroll;
	gap: 12px;
	border-radius: 16px;
}

.boardDate {
	position: sticky;
	top: 0;
	z-index: 2;
	display: flex;
	align-items: center;
	height: 44px;
	padding-left: 10px;
	color: #ffffff;
	background: #121213;
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
	position: relative;
	display: flex;
	align-items: end;
	height: 30px;
	padding-bottom: 4px;
	padding-left: 10px;
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

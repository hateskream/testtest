<script setup lang="ts">
import { computed, nextTick, ref, useTemplateRef, watch } from 'vue';
import { useLocalStorage } from '@vueuse/core';

import {
	CalendarEventBoard,
	CalendarToolbar,
	EventType,
	getEndOfWeek,
	getStartOfWeek,
	type IDailyCalendarInfo,
	type IEventBoard,
	type IEventBoardRange,
	Impact,
	type IToolbarState,
	type IWeeklyDayInfo,
	markets,
	toUtcIsoDate,
	toWeekDays,
} from '@/modules/calendar';
import type { IWatchlist } from '@/modules/watchlist';

interface ICalendarWeeklyContainerProps {
	locale?: string;
	weekStartsOn?: 'monday' | 'sunday';
	currentDate?: Date;
	watchlists: IWatchlist[];
	eventBoard: IEventBoard[];
	dailyCalendarData: IDailyCalendarInfo[];
}

const props = withDefaults(defineProps<ICalendarWeeklyContainerProps>(), {
	locale: 'en-US',
	weekStartsOn: 'monday',
	currentDate: () => new Date(),
});

const weekRange = defineModel<IEventBoardRange>('week-range', { required: true });
const toolbar = defineModel<IToolbarState>('toolbar', { required: true });

const baseDate = ref(new Date(props.currentDate));

watch(baseDate, newValue => {
	weekRange.value.from = toUtcIsoDate(getStartOfWeek(newValue));
	weekRange.value.to = toUtcIsoDate(getEndOfWeek(newValue));
});

function resetWeek() {
	baseDate.value = props.currentDate;
}

const eventBoardFavorites = useLocalStorage<string[]>('calendar-event-board-favorites', [], {
	deep: true,
});
const eventBoardRef = useTemplateRef('event-board-component');

watch([() => props.eventBoard.length, baseDate], async ([_, date]) => {
	await nextTick();

	const iso = toUtcIsoDate(date);

	eventBoardRef.value?.scrollToDate(iso, {
		behavior: 'auto',
	});
}, { immediate: true });

function toggleFavorite(id: string) {
	if (eventBoardFavorites.value.includes(id)) {
		eventBoardFavorites.value.splice(eventBoardFavorites.value.indexOf(id), 1);
	} else {
		eventBoardFavorites.value.push(id);
	}
}

const weekDays = computed<IWeeklyDayInfo[]>(() => {
	return toWeekDays(
		props.dailyCalendarData,
		baseDate.value,
		props.locale,
		props.eventBoard,
		eventBoardFavorites.value,
	);
});

function prevWeek() {
	const d = new Date(baseDate.value);
	d.setDate(d.getDate() - 7);

	baseDate.value = d;
}

function nextWeek() {
	const d = new Date(baseDate.value);
	d.setDate(d.getDate() + 7);

	baseDate.value = d;
}
</script>

<template>
	<div :class="classes.calendarMain">
		<calendar-toolbar
			v-model:country-state="toolbar.marketId"
			v-model:impact-state="toolbar.impact"
			v-model:event-state="toolbar.eventType"
			v-model:watchlist-id-state="toolbar.watchlistId"
			v-model:watchlist-section-state="toolbar.watchlistSection"
			v-model:range-state="weekRange"
			:initial-date="props.currentDate"
			:base-date="baseDate"
			:markets="markets"
			:event-types="Object.values(EventType)"
			:impacts="Object.values(Impact)"
			:week-days="weekDays"
			:locale="props.locale"
			:watchlists="watchlists"
			@next-week="nextWeek"
			@prev-week="prevWeek"
			@reset-week="resetWeek"
		/>
		<calendar-event-board
			ref="event-board-component"
			:event-board="eventBoard"
			:event-board-favorites="eventBoardFavorites"
			@toggle-event-board="toggleFavorite"
		/>
	</div>
</template>

<style module="classes">
.calendarMain {
	display: flex;
	flex-direction: column;
	align-items: center;
	align-self: stretch;
	height: 100%;
	padding: 0 8px 10px;
	overflow: hidden;
	gap: 8px;
}
</style>

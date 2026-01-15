<script setup lang="ts">
import { useTemplateRef } from 'vue';

import {
	CalendarEmptyEventBoard,
	CalendarEventBoard,
	EventType,
	type IDailyCalendarInfoResponse, type IEventBoardExposed,
	type IEventBoardRange,
	type IEventBoardItem,
	Impact,
	type IWeeklyDayInfo,
	MarketIds,
	markets,
	useEventBoardScroll,
} from '@/modules/calendar';
import type { IWatchlist } from '@/modules/watchlist';

import CalendarToolbar from '@/modules/calendar/ui/toolbar/calendar-toolbar.vue';


interface ICalendarWeeklyContainerProps {
	displayVariant: 'new' | 'default';
	locale?: string;
	weekStartsOn?: 'monday' | 'sunday';
	currentDate?: Date;
	watchlists: IWatchlist[];
	eventBoard: IEventBoardItem[];
	dailyCalendarData: IDailyCalendarInfoResponse[];
	baseDate: Date;
	weekDays: IWeeklyDayInfo[];
	eventBoardFavorites: string[];
}

const props = withDefaults(defineProps<ICalendarWeeklyContainerProps>(), {
	locale: 'en-US',
	weekStartsOn: 'monday',
	currentDate: () => new Date(),
});

const emits = defineEmits<{
	nextWeek: [];
	prevWeek: [];
	resetWeek: [];
	toggleFavorite: [id: string];
	resetAll: [];
}>();

const weekRange = defineModel<IEventBoardRange>('weekRange', { required: true });

const countryState = defineModel<Set<MarketIds>>('countryState', { required: true });
const impactState = defineModel<Set<Impact>>('impactState', { required: true });
const eventState = defineModel<Set<EventType>>('eventState', { required: true });
const watchlistIdState = defineModel<string | null>('watchlistIdState', { required: true });
const watchlistSectionState = defineModel<string | null>('watchlistSectionState', { required: true });

const eventBoardRef = useTemplateRef<IEventBoardExposed>('event-board-component');

useEventBoardScroll({
	ref: eventBoardRef,
	board: props.eventBoard,
	baseDate: props.baseDate,
});
</script>

<template>
	<div :class="classes.calendarMain">
		<calendar-toolbar
			v-model:country-state="countryState"
			v-model:impact-state="impactState"
			v-model:event-state="eventState"
			v-model:watchlist-id-state="watchlistIdState"
			v-model:watchlist-section-state="watchlistSectionState"
			v-model:range-state="weekRange"
			:display-variant
			:initial-date="props.currentDate"
			:base-date="baseDate"
			:markets="markets"
			:event-types="Object.values(EventType)"
			:impacts="Object.values(Impact)"
			:week-days="weekDays"
			:locale="props.locale"
			:watchlists="watchlists"
			@next-week="emits('nextWeek')"
			@prev-week="emits('prevWeek')"
			@reset-week="emits('resetWeek')"
		/>
		<calendar-event-board
			v-if="eventBoard.length"
			ref="event-board-component"
			:event-board="eventBoard"
			:event-board-favorites="eventBoardFavorites"
			@toggle-event-board="emits('toggleFavorite', $event)"
		/>
		<calendar-empty-event-board
			v-else
			@reset="emits('resetAll')"
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

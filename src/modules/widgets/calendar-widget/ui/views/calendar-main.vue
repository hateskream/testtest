<script setup lang="ts">
import { useTemplateRef } from 'vue';

import {
	CalendarEventBoard,
	CalendarToolbar,
	EventType,
	type IDailyCalendarInfoResponse,
	type IEventBoardRange,
	type IEventBoardResponse,
	Impact,
	type IToolbarState,
	type IWeeklyDayInfo,
	markets,
	useEventBoardScroll,
} from '@/modules/calendar';
import type { IWatchlist } from '@/modules/watchlist';

interface ICalendarWeeklyContainerProps {
	locale?: string;
	weekStartsOn?: 'monday' | 'sunday';
	currentDate?: Date;
	watchlists: IWatchlist[];
	eventBoard: IEventBoardResponse[];
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
}>();

const weekRange = defineModel<IEventBoardRange>('week-range', { required: true });
const toolbar = defineModel<IToolbarState>('toolbar', { required: true });

const eventBoardRef = useTemplateRef('event-board-component');

useEventBoardScroll({
	ref: eventBoardRef,
	board: props.eventBoard,
	baseDate: props.baseDate,
});
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
			@next-week="emits('nextWeek')"
			@prev-week="emits('prevWeek')"
			@reset-week="emits('resetWeek')"
		/>
		<calendar-event-board
			ref="event-board-component"
			:event-board="eventBoard"
			:event-board-favorites="eventBoardFavorites"
			@toggle-event-board="emits('toggleFavorite', $event)"
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

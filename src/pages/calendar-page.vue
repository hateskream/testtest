<script setup lang="ts">
import { useTemplateRef } from 'vue';

import {
	CalendarEmptyEventBoard,
	CalendarLayout,
	CalendarNews,
	type IEventBoardExposed,
	markets,
	useCalendarState,
	useEventBoardScroll,
} from '@/modules/calendar';
import { EventType, Impact } from '@/modules/calendar/models';
import { AppLayout } from '@/modules/layout';
import { CalendarWeeklyInfo } from '@/modules/calendar/ui';
import { CalendarDaySelect } from '@/shared/ui/calendar';

import CalendarEventBoard from '@/modules/calendar/ui/calendar-event-board.vue';
import CalendarToolbar from '@/modules/calendar/ui/toolbar/calendar-toolbar.vue';

interface ICalendarWeeklyContainerProps {
	locale?: string;
	weekStartsOn?: 'monday' | 'sunday';
	initialDate?: Date;
}

const props = withDefaults(defineProps<ICalendarWeeklyContainerProps>(), {
	locale: 'en-US',
	weekStartsOn: 'monday',
	initialDate: () => new Date(),
});

const eventBoardRef = useTemplateRef<IEventBoardExposed>('event-board-component');

const {
	isDailyCalendarLoading,
	isEventBoardLoading,
	weekRange,
	baseDate,
	selectedDate,
	resetAll,
	nextWeek,
	prevWeek,
	resetWeek,
	setSelected,
	marketId,
	impact,
	eventType,
	watchlistId,
	watchlistSection,
	weekDays,
	watchlists,
	eventBoard,
	eventBoardFavorites,
	toggleFavorite,
} = useCalendarState({
	toolbar: {
		useQuery: true,
		widgetId: 'calendar-page',
	},
});

useEventBoardScroll({
	ref: eventBoardRef,
	board: eventBoard,
	baseDate: baseDate,
});
</script>

<template>
	<app-layout>
		<div :class="classes.container">
			<h2 :class="classes.header">Calendar</h2>
			<calendar-layout>
				<template #content>
					<calendar-toolbar
						v-if="!isDailyCalendarLoading"
						v-model:country-state="marketId"
						v-model:impact-state="impact"
						v-model:event-state="eventType"
						v-model:watchlist-id-state="watchlistId"
						v-model:watchlist-section-state="watchlistSection"
						v-model:range-state="weekRange"
						display-variant="new"
						:initial-date="props.initialDate"
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

					<calendar-weekly-info
						v-if="!isDailyCalendarLoading"
						:week-days="weekDays"
						:selected-date="selectedDate"
						@select-day="setSelected"
					/>

					<!--		TODO: Add loader component			-->
					<div v-if="isEventBoardLoading" class="loading" />

					<calendar-event-board
						v-else-if="eventBoard.length"
						ref="event-board-component"
						:event-board="eventBoard"
						:event-board-favorites="eventBoardFavorites"
						@toggle-event-board="toggleFavorite"
					/>

					<calendar-empty-event-board
						v-else
						@reset="resetAll"
					/>
				</template>

				<template #calendar-sidebar>
					<calendar-day-select
						v-model="selectedDate"
						@update-week="setSelected"
					/>

					<calendar-news />
				</template>
			</calendar-layout>
		</div>
	</app-layout>
</template>

<style module="classes">
.container {
	padding: 20px;
}

.header {
	margin: 16px 0;
	font-style: normal;
	font-weight: 340;
	font-size: 32px;
	line-height: 100%;
	color: var(--text-color-base-500);
}
</style>

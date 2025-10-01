<script setup lang="ts">
import { useTemplateRef } from 'vue';

import { CalendarLayout, markets, useCalendarState, useEventBoardScroll } from '@/modules/calendar';
import { EventType, Impact } from '@/modules/calendar/models';
import { LayoutComponent } from '@/modules/layout';
import { CalendarDaySelect, CalendarEventBoard, CalendarToolbar, CalendarWeeklyInfo } from '@/modules/calendar/ui';
import { NewsDashboard } from '@/modules/widgets/news';

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

const eventBoardRef = useTemplateRef('event-board-component');

const {
	isDailyCalendarLoading,
	weekRange,
	baseDate,
	selectedDate,
	nextWeek,
	prevWeek,
	resetWeek,
	setSelected,
	toolbar,
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
	<layout-component :is-curtain-fixed="false">
		<template #header>
			<div :class="classes.header">Calendar</div>
		</template>
		<template #content>
			<calendar-layout>
				<template #content>
					<calendar-toolbar
						v-if="!isDailyCalendarLoading"
						v-model:country-state="toolbar.marketId"
						v-model:impact-state="toolbar.impact"
						v-model:event-state="toolbar.eventType"
						v-model:watchlist-id-state="toolbar.watchlistId"
						v-model:watchlist-section-state="toolbar.watchlistSection"
						v-model:range-state="weekRange"
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

					<calendar-event-board
						v-if="eventBoard.length"
						ref="event-board-component"
						:event-board="eventBoard"
						:event-board-favorites="eventBoardFavorites"
						@toggle-event-board="toggleFavorite"
					/>
				</template>

				<template #calendar-sidebar>
					<calendar-day-select
						v-model="selectedDate"
						@update-week="setSelected"
					/>

					<!-- TODO: after refactoring widget system to reusable modules,
						we can replace this with module instead of full widget -->
					<news-dashboard
						:meta="{
							isLoading: false,
							name: '',
							isResizing: false,
							widgetId: 'news',
							market: 'crypto',
							size: { h: 1, w: 1 },
							defaultStateType: 'normal'
						}"
					/>
				</template>
			</calendar-layout>
		</template>
	</layout-component>
</template>

<style module="classes">
.header {
	font-style: normal;
	font-weight: 340;
	font-size: 32px;
	line-height: 100%;
	color: var(--text-color-base-500);
}

</style>

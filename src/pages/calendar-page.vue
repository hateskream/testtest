<script setup lang="ts">
import { computed, reactive, ref } from 'vue';

import { LayoutComponent } from '@/modules/layout';
import {
	CalendarLayout,
	EventType,
	Impact,
	type IToolbarUserState,
	MarketIds,
	markets,
	toWeekDays,
	useDailyCalendarGetState,
	useEventBoardGetState,
} from '@/modules/calendar';
import { CalendarDaySelect, CalendarEventBoard, CalendarToolbar, CalendarWeeklyInfo } from '@/modules/calendar/ui';
import { NewsDashboard } from '@/modules/widgets/news';
import { useWatchlist } from '@/modules/watchlist';
import type { IWeeklyDayInfo } from '@/modules/calendar/types/weekly-calendar-info.ts';

const { watchlists } = useWatchlist();

const toolbarState = reactive<IToolbarUserState>({
	marketId: MarketIds.EntireWorld,
	impact: Impact.All,
	eventType: EventType.All,
	watchlist: {
		selectedId: null,
		selectedSectionId: null,
	},
});

interface ICalendarWeeklyContainerProps {
	locale?: string;
	weekStartsOn?: 'monday' | 'sunday';
	initialDate?: Date | string | number;
}

const props = withDefaults(defineProps<ICalendarWeeklyContainerProps>(), {
	locale: 'en-US',
	weekStartsOn: 'monday',
	initialDate: () => new Date(),
});

const { data: dailyCalendarData, isLoading: isDailyCalendarLoading } = useDailyCalendarGetState();
const { data: eventBoardData, isLoading: isEventBoardLoading } = useEventBoardGetState({
	from: '2025-09-01',
	to: '2025-11-30',
	filters: toolbarState,
});

const baseDate = ref(new Date(props.initialDate));
const selectedDate = ref(new Date(baseDate.value));

const weekDays = computed<IWeeklyDayInfo[]>(() => {
	if (isDailyCalendarLoading.value || !dailyCalendarData.value) {
		return [];
	}

	return toWeekDays(dailyCalendarData.value, baseDate.value, props.locale);
});

function setSelected(date: Date) {
	selectedDate.value = new Date(date);
	baseDate.value = new Date(date);
}

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
	<layout-component v-if="!isDailyCalendarLoading && !isEventBoardLoading" :is-curtain-fixed="false">
		<template #header>
			<div :class="classes.header">Calendar</div>
		</template>
		<template #content>
			<calendar-layout>
				<template #content>
					<calendar-toolbar
						v-model:state="toolbarState"
						v-model:selected-date="selectedDate"
						:markets="markets"
						:event-types="Object.values(EventType)"
						:impacts="Object.values(Impact)"
						:week-days="weekDays"
						:locale="props.locale"
						:watchlists="watchlists"
						@next-week="nextWeek"
						@prev-week="prevWeek"
					/>

					<calendar-weekly-info
						:week-days="weekDays"
						:selected-date="selectedDate"
						@select-day="setSelected"
					/>

					<calendar-event-board
						v-if="eventBoardData"
						:event-board="eventBoardData"
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

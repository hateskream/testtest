<script setup lang="ts">
import { computed, nextTick, reactive, ref, useTemplateRef, watch } from 'vue';

import { LayoutComponent } from '@/modules/layout';
import {
	CalendarLayout,
	EventType,
	getEndOfWeek,
	getStartOfWeek,
	type IEventBoardRange,
	Impact,
	markets,
	toUtcIsoDate,
	toWeekDays,
	useDailyCalendarGetState,
	useEventBoard,
	useToolbarState,
} from '@/modules/calendar';
import { CalendarDaySelect, CalendarEventBoard, CalendarToolbar, CalendarWeeklyInfo } from '@/modules/calendar/ui';
import { NewsDashboard } from '@/modules/widgets/news';
import { useWatchlist } from '@/modules/watchlist';
import type { IWeeklyDayInfo } from '@/modules/calendar/types/weekly-calendar-info.ts';

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

const baseDate = ref(new Date(props.initialDate));
const selectedDate = ref(new Date(baseDate.value));

const { watchlists } = useWatchlist();

const { state: toolbar } = useToolbarState();

const weekRange = reactive<IEventBoardRange>({
	from: toUtcIsoDate(getStartOfWeek(baseDate.value)),
	to: toUtcIsoDate(getEndOfWeek(baseDate.value)),
});

watch(baseDate, newValue => {
	weekRange.from = toUtcIsoDate(getStartOfWeek(newValue));
	weekRange.to = toUtcIsoDate(getEndOfWeek(newValue));
});

function resetWeek() {
	baseDate.value = props.initialDate;
	weekRange.from = toUtcIsoDate(getStartOfWeek(props.initialDate));
	weekRange.to = toUtcIsoDate(getEndOfWeek(props.initialDate));
}

const watchlistSelectedSections = computed(() => {
	if (!toolbar.watchlistSection) {
		return watchlists.value
			.find(v => v.id === toolbar.watchlistId)
			?.sections.flatMap(v => v.tickerIds) || [];
	}

	return watchlists.value
		.find(v => v.id === toolbar.watchlistId)
		?.sections.find(v => v.name === toolbar.watchlistSection)
		?.tickerIds || [];
});

const filters = computed(() => ({
	range: weekRange,
	filters: {
		marketId: toolbar.marketId,
		impact: toolbar.impact,
		eventType: toolbar.eventType,
		watchlist: watchlistSelectedSections.value,
	},
}));

const { eventBoard } = useEventBoard(filters);

const eventBoardRef = useTemplateRef('event-board-component');

watch([() => eventBoard.value.length, baseDate], async ([len, date]) => {
	if (len === 0) {
		return;
	}

	await nextTick();

	const iso = toUtcIsoDate(date);

	eventBoardRef.value?.scrollToDate(iso, {
		behavior: 'auto',
	});
}, { immediate: true });

const { data: dailyCalendarData, isLoading: isDailyCalendarLoading } = useDailyCalendarGetState();

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
	<layout-component v-if="!isDailyCalendarLoading" :is-curtain-fixed="false">
		<template #header>
			<div :class="classes.header">Calendar</div>
		</template>
		<template #content>
			<calendar-layout>
				<template #content>
					<calendar-toolbar
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
						:week-days="weekDays"
						:selected-date="selectedDate"
						@select-day="setSelected"
					/>

					<calendar-event-board
						v-if="eventBoard.length"
						ref="event-board-component"
						:event-board="eventBoard"
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

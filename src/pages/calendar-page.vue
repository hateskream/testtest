<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';

import {
	CalendarPageNews,
	CalendarPageLayout,
	CalendarPageDailyInfo,
	CalendarPageDaySelect,
	TvCalendarToolbar,
	TvEventBoard,
	useCalendarState,
	getUTCWeekRange,
	toUTCMidnightUnix,
	useInfiniteQueryEventBoard,
	useQueryDailyInfo,
} from '@/modules/calendar-new';

const { currentTime, selectedCategories, selectedCountries, selectedImpacts } = useCalendarState({
	widget: {
		isEphemeral: false,
		widgetId: 'calendar-page',
	},
});

const limit = ref(getUTCWeekRange(currentTime.value));

const initialFrom = computed(() => {
	const today = toUTCMidnightUnix(currentTime.value);
	const { from, to } = limit.value;
	return today >= from && today <= to ? today : from;
});

const selectedDate = ref(new Date(initialFrom.value * 1000));

const selectedDateStr = computed(() => {
	const d = new Date(selectedDate.value);
	const y = d.getUTCFullYear();
	const m = String(d.getUTCMonth() + 1).padStart(2, '0');
	const day = String(d.getUTCDate()).padStart(2, '0');
	return `${y}-${m}-${day}`;
});

const query = reactive(useInfiniteQueryEventBoard(() => ({
	from: initialFrom.value,
	categories: selectedCategories.value,
	countries: selectedCountries.value,
	minImpact: selectedImpacts.value,
	limit: {
		from: limit.value.from,
		to: limit.value.to,
	},
})));

const WEEK_S = 7 * 86400;

const dailyInfoRange = computed(() => {
	const { from, to } = limit.value;

	const srcDate = new Date(from * 1000);
	const weekday = srcDate.getUTCDay();
	const daysToMonday = weekday === 0 ? 6 : weekday - 1;

	const mondayUnix = from - daysToMonday * 86400;
	const weekEndUnix = mondayUnix + WEEK_S - 1;

	const rangeFromUnix = mondayUnix;
	const rangeToUnix = from === to ? weekEndUnix : Math.min(weekEndUnix, to);

	const formatUTC = (unix: number) => {
		const d = new Date(unix * 1000);
		const y = d.getUTCFullYear();
		const m = String(d.getUTCMonth() + 1).padStart(2, '0');
		const day = String(d.getUTCDate()).padStart(2, '0');
		return `${y}-${m}-${day}`;
	};

	return { from: formatUTC(rangeFromUnix), to: formatUTC(rangeToUnix) };
});

const dailyInfo = reactive(useQueryDailyInfo({
	from: () => dailyInfoRange.value.from,
	to: () => dailyInfoRange.value.to,
}));

watch(selectedDate, (d) => {
	const unix = toUTCMidnightUnix(d);
	limit.value = { from: unix, to: unix };
});


watch(initialFrom, (val) => {
	selectedDate.value = new Date(val * 1000);
});

function onSelectDay(date: string) {
	selectedDate.value = new Date(`${date}T00:00:00Z`);
}

function onUpdateWeek(date: Date) {
	selectedDate.value = date;
}
</script>

<template>
	<app-layout>
		<div :class="classes.container">
			<h2 :class="classes.header">Calendar</h2>
			<calendar-page-layout>
				<template #content>
					<tv-calendar-toolbar
						v-model:categories="selectedCategories"
						v-model:countries="selectedCountries"
						v-model:impact="selectedImpacts"
						v-model:range="limit"
					/>

					<calendar-page-daily-info
						v-if="!dailyInfo.isLoading && dailyInfo.data"
						:weeks="dailyInfo.data"
						:selected-date="selectedDateStr"
						@select-day="onSelectDay"
					/>

					<!--		TODO: Add loader component			-->
					<div v-if="query.isLoading" class="loading" />

					<div v-else-if="query.data?.days.length" :class="classes.wrapper">
						<tv-event-board
							ref="event-board-component"
							:event-board="query.data.days"
							:is-fetching-next="query.isFetchingNextPage"
							:is-fetching-prev="query.isFetchingPreviousPage"
							header-color="#0C0C0D"
							@load-next="query.fetchNextPage"
							@load-prev="query.fetchPreviousPage"
						/>
					</div>
				</template>

				<template #calendar-sidebar>
					<calendar-page-day-select v-model="selectedDate" @update-week="onUpdateWeek" />

					<calendar-page-news />
				</template>
			</calendar-page-layout>
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

.wrapper {
	background: var(--color-bg-surface-01,#0c0c0d);
  border-radius: 16px;
  flex-direction: column;
  flex: 1 0 0;
  align-self: stretch;
  gap: 12px;
  display: flex;
  overflow-y: hidden;
}
</style>

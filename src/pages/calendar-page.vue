<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';

import { AppLayout } from '@/modules/layout';
import {
	CalendarPageNews,
	CalendarPageLayout,
	CalendarPageDailyInfo,
	CalendarPageDaySelect,
	TvCalendarToolbar,
	TvEventBoard,
	useCalendarState,
	formatUTCDate,
	getUTCWeekRange,
	localDateToUTCUnix,
	useInfiniteQueryEventBoard,
	useQueryDailyInfo,
} from '@/modules/calendar-new';

const { currentTime, selectedCategories, selectedCountries, selectedImpacts } = useCalendarState({
	widget: {
		isEphemeral: false,
		widgetId: 'calendar-page',
	},
});

const selectedDate = ref(currentTime.value);
const limit = ref(getUTCWeekRange(new Date(localDateToUTCUnix(currentTime.value) * 1000)));

const selectedDateUnix = computed(() => localDateToUTCUnix(selectedDate.value));
const selectedDateStr = computed(() => formatUTCDate(new Date(selectedDateUnix.value * 1000)));

const initialFrom = computed(() => {
	const { from, to } = limit.value;
	const date = selectedDateUnix.value;
	return date >= from && date <= to ? date : from;
});

const dailyInfoWeekRange = computed(() => {
	const week = getUTCWeekRange(new Date(limit.value.from * 1000));
	return {
		from: formatUTCDate(new Date(week.from * 1000)),
		to: formatUTCDate(new Date(week.to * 1000)),
	};
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

const dailyInfo = reactive(useQueryDailyInfo(() => ({
	from: dailyInfoWeekRange.value.from,
	to: dailyInfoWeekRange.value.to,
})));

let skipLimitSync = false;

watch(selectedDate, (d) => {
	if (skipLimitSync) {
		skipLimitSync = false;
		return;
	}
	const unix = localDateToUTCUnix(d);
	limit.value = { from: unix, to: unix };
});

function onSelectDay(date: string) {
	selectedDate.value = new Date(`${date}T00:00:00`);
}

function onUpdateWeek(date: Date) {
	const unix = localDateToUTCUnix(date);
	limit.value = getUTCWeekRange(new Date(unix * 1000));
	skipLimitSync = true;
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
	display: flex;
	flex: 1 0 0;
	flex-direction: column;
	align-self: stretch;
	overflow-y: hidden;
	background: var(--color-bg-surface-01, #0c0c0d);
	border-radius: 16px;
	gap: 12px;
}
</style>

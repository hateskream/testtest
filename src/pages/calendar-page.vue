<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

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
	useEventBoardClientFiltration,
	useInfiniteQueryEventBoard,
	useQueryDailyInfo, CalendarPreloaderComponent,
} from '@/modules/calendar';
import { BaseErrorComponent } from '@/modules/widgets/base';

import CalendarDaysPreloaderComponent from '@/modules/calendar/ui/common/calendar-days-preloader-component.vue';

const route = useRoute();

const { currentTime, selectedCategories, selectedCountries, selectedImpacts, resetAll } = useCalendarState({
	widget: {
		isEphemeral: false,
		widgetId: 'calendar-page',
	},
});

const queryDate = computed(() => {
	const raw = route.query.date;
	if (typeof raw !== 'string') {
		return undefined;
	}
	const parsed = new Date(raw);
	if (Number.isNaN(parsed.getTime())) {
		return undefined;
	}
	return parsed;
});

const scrollToDate = computed(() => {
	const d = queryDate.value;
	if (!d) {
		return undefined;
	}
	return formatUTCDate(d);
});

const scrollToHour = computed(() => {
	const d = queryDate.value;
	if (!d) {
		return undefined;
	}
	return `${String(d.getUTCHours()).padStart(2, '0')}:00`;
});

const todayStr = computed(() => {
	const today = currentTime.value;
	today.setUTCHours(0, 0, 0, 0);

	return today.toISOString().slice(0, 10);
});

const selectedDate = ref(queryDate.value ?? currentTime.value);
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

const { filteredData } = useEventBoardClientFiltration({
	data: () => query.data,
	categories: () => selectedCategories.value,
	countries: () => selectedCountries.value,
	impacts: () => selectedImpacts.value,
});

const filteredDays = computed(() => filteredData.value?.days ?? []);

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

					<calendar-days-preloader-component
						v-if="dailyInfo.isLoading && !dailyInfo.data"
					/>

					<calendar-page-daily-info
						v-else-if="!dailyInfo.isLoading && dailyInfo.data"
						:today-str="todayStr"
						:weeks="dailyInfo.data"
						:selected-date="selectedDateStr"
						@select-day="onSelectDay"
					/>

					<calendar-preloader-component v-if="query.isLoading" />
					<base-error-component v-else-if="query.isError" @retry="query.refetch" />

					<div v-else-if="query.data" :class="classes.wrapper">
						<tv-event-board
							ref="event-board-component"
							:event-board="filteredDays"
							:is-fetching-next="query.isFetchingNextPage"
							:is-fetching-prev="query.isFetchingPreviousPage"
							:scroll-to-date="scrollToDate"
							:scroll-to-hour="scrollToHour"
							header-color="#0C0C0D"
							@load-next="query.fetchNextPage"
							@load-prev="query.fetchPreviousPage"
							@reset="resetAll"
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

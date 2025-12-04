<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseWidgetTvComponent, BaseErrorComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { useCalendarState } from '@/modules/calendar';

import CalendarLoader from '../views/calendar-loader.vue';

const CalendarMain = defineAsyncComponent({
	loader: () => import('../views/calendar-main.vue'),
	loadingComponent: CalendarLoader,
	errorComponent: BaseErrorComponent,
});

const props = defineProps<{
	meta: IMeta;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
	(e: 'moveTo', dashboardId: string): void;
	(e: 'duplicate'): void;
}>();

const {
	locale,
	now,
	baseDate,
	isDailyCalendarLoading,
	isEventBoardLoading,
	watchlists,
	eventBoard,
	eventBoardFavorites,
	dailyCalendar,
	marketId,
	impact,
	eventType,
	watchlistId,
	watchlistSection,
	weekRange,
	weekDays,
	isError,
	toggleFavorite,
	nextWeek,
	prevWeek,
	resetWeek,
	refetch,
	resetAll,
} = useCalendarState({
	toolbar: {
		useQuery: false,
		widgetId: props.meta.widgetId,
		defaultState: props.meta.defaultStateType,
	},
});

const isLoading = computed(
	() => (isDailyCalendarLoading.value && isEventBoardLoading.value) || props.meta.isLoading,
);
</script>

<template>
	<base-widget-tv-component
		:meta="props.meta"
		has-reset
		@reset="resetAll"
		@delete="emit('delete')"
		@duplicate="emit('duplicate')"
		@move-to="emit('moveTo', $event)"
	>
		<template #title>
			<span>{{ props.meta.name }}</span>
		</template>

		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />

			<calendar-loader v-else-if="isLoading" />

			<calendar-main
				v-else-if="eventBoard && dailyCalendar"
				v-model:week-range="weekRange"
				v-model:country-state="marketId"
				v-model:impact-state="impact"
				v-model:event-state="eventType"
				v-model:watchlist-id-state="watchlistId"
				v-model:watchlist-section-state="watchlistSection"
				display-variant="default"
				:event-board-favorites="eventBoardFavorites"
				:base-date="baseDate"
				:locale="locale"
				:week-days="weekDays"
				:watchlists="watchlists"
				:event-board="eventBoard"
				:daily-calendar-data="dailyCalendar"
				:current-date="now"
				@toggle-favorite="toggleFavorite"
				@reset-week="resetWeek"
				@prev-week="prevWeek"
				@next-week="nextWeek"
				@reset-all="resetAll"
			/>
		</template>
	</base-widget-tv-component>
</template>

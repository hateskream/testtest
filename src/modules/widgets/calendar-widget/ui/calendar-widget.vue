<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue';

import { BaseDashboardComponent, BaseErrorComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group';
import { useCalendarState } from '@/modules/calendar';

import CalendarLoader from './views/calendar-loader.vue';
import CalendarContextMenu from './calendar-context-menu.vue';

const CalendarMain = defineAsyncComponent({
	loader: () => import('./views/calendar-main.vue'),
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
	toolbar,
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
	},
});

const isLoading = computed(
	() => (isDailyCalendarLoading.value && isEventBoardLoading.value) || props.meta.isLoading,
);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<span>{{ props.meta.name }}</span>
		</template>

		<template #content>
			<base-error-component v-if="isError" @retry="refetch" />

			<calendar-loader v-else-if="isLoading" :count="5" />

			<calendar-main
				v-else-if="eventBoard && dailyCalendar"
				v-model:week-range="weekRange"
				v-model:toolbar="toolbar"
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

		<template #rcm>
			<calendar-context-menu
				:title="props.meta.name"
				:dashboards="props.meta.dashboards"
				@delete="emit('delete')"
				@move-to="emit('moveTo', $event)"
				@duplicate="emit('duplicate')"
			/>
			<!-- @reset="resetAllChanges" -->
		</template>
	</base-dashboard-component>
</template>

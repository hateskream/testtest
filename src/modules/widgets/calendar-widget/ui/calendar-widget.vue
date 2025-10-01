<script setup lang="ts">
import { computed } from 'vue';

import { BaseDashboardComponent, BaseErrorComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group/core';
import { useCalendarState } from '@/modules/calendar';

import CalendarLoader from './views/calendar-loader.vue';
import CalendarContextMenu from './calendar-context-menu.vue';
import CalendarMain from './views/calendar-main.vue';

const props = defineProps<{
	meta: IMeta;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
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
} = useCalendarState({
	toolbar: {
		useQuery: false,
		widgetId: props.meta.widgetId,
	},
});

const isLoading = computed(
	() => isDailyCalendarLoading.value && isEventBoardLoading.value,
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
			/>
		</template>

		<template #rcm>
			<calendar-context-menu
				:title="props.meta.name"
				@delete="emit('delete')"
				@reset="null"
			/>
			<!-- @reset="resetAllChanges" -->
		</template>
	</base-dashboard-component>
</template>

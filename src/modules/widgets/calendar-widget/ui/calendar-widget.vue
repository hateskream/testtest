<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useNow } from '@vueuse/core';

import { BaseDashboardComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group/core';
import {
	EventType,
	getEndOfWeek,
	getStartOfWeek,
	type IEventBoardRange,
	Impact,
	type IToolbarState,
	MarketIds,
	toUtcIsoDate,
	useDailyCalendarGetState,
	useEventBoard,
} from '@/modules/calendar';
import { useWatchlist } from '@/modules/watchlist';

import CalendarError from './views/calendar-error.vue';
import CalendarLoader from './views/calendar-loader.vue';
import CalendarContextMenu from './calendar-context-menu.vue';
import CalendarMain from './views/calendar-main.vue';

const props = defineProps<{
	meta: IMeta;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

const now = useNow({ interval: 60_000 	});

const { watchlists } = useWatchlist();
const toolbar = ref<IToolbarState>({
	marketId: MarketIds.EntireWorld,
	impact: Impact.All,
	eventType: EventType.All,
	watchlistId: null,
	watchlistSection: null,
});

const watchlistSelectedSections = computed(() => {
	if (!toolbar.value.watchlistSection) {
		return watchlists.value
			.find(v => v.id === toolbar.value.watchlistId)
			?.sections.flatMap(v => v.tickerIds) || [];
	}

	return watchlists.value
		.find(v => v.id === toolbar.value.watchlistId)
		?.sections.find(v => v.name === toolbar.value.watchlistSection)
		?.tickerIds || [];
});

const weekRange = reactive<IEventBoardRange>({
	from: toUtcIsoDate(getStartOfWeek(now.value)),
	to: toUtcIsoDate(getEndOfWeek(now.value)),
});

const filters = computed(() => ({
	range: weekRange,
	filters: {
		marketId: toolbar.value.marketId,
		impact: toolbar.value.impact,
		eventType: toolbar.value.eventType,
		watchlist: watchlistSelectedSections.value,
	},
}));

const {
	eventBoard,
	isLoading: isEventBoardLoading,
} = useEventBoard(filters);

const {
	data: dailyCalendar,
	isLoading: isDailyCalendarLoading,
} = useDailyCalendarGetState();

const isLoading = computed(() => {
	return isEventBoardLoading.value && isDailyCalendarLoading.value;
});
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<span>{{ props.meta.name }}</span>
		</template>

		<template #content>
			<calendar-error v-if="false" />

			<calendar-loader v-else-if="isLoading" :count="5" />

			<calendar-main
				v-else-if="eventBoard && dailyCalendar"
				v-model:week-range="weekRange"
				v-model:toolbar="toolbar"
				:watchlists="watchlists"
				:event-board="eventBoard"
				:daily-calendar-data="dailyCalendar"
				:current-date="now"
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

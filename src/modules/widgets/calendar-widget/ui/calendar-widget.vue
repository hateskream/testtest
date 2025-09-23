<script setup lang="ts">
// import { computed } from 'vue';

import { BaseDashboardComponent } from '@/modules/widgets/base';
import type { IMeta } from '@/modules/dashboard-group/core';

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

// const {
// 	tabs,
// 	columns,
// 	sections,
// 	tickerIds,

// 	addNewWatchlist,
// 	renameWatchlist,
// 	handlerSwitchTab,
// 	duplicateWatchlist,
// 	removeWatchlist,

// 	resetAllChanges,

// 	handlerAddToWatchlist,
// 	handlerRemoveFromWatchlist,

// 	createNewWatchlist,
// } = useWatchlistWidget(props.meta.widgetId);

// const { data, isLoading, isError } = useQueryTickers(tickerIds);

// const noData = computed(() => !!data?.value && isLoading.value);
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<span>{{ props.meta.name }}</span>
		</template>

		<template #content>
			<!-- <calendar-error v-if="isError" /> -->
			<calendar-error v-if="false" />

			<!-- <calendar-loader v-if="noData" :count="5" /> -->
			<calendar-loader v-if="false" :count="5" />
			<!-- <calendar-main v-if="data" /> -->
			<calendar-main v-if="true" />
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

<script setup lang="ts">
import { computed, watch } from 'vue';

import { BaseDashboardComponent } from '../../base/index.ts';
import type { IMeta } from '@/modules/dashboard-group/core/index.ts';
import type { IGetWatchlistRequest } from '../api/watchlist-data.api.ts';
import type { IWatchlistSection } from '../model/sections.model.ts';
import { useQueryWatchlistWidget, useQueryWatchlistData } from '../queries/watchlist.query.ts';
import { useWatchlistSectionStore } from '../stores/watchlist-section.store.ts';
import { useWatchlistTabsStore } from '../stores/watchlist-tabs.store.ts';
import { useWatchlist } from '../composables';

import WatchlistError from './views/watchlist-error.vue';
import WatchlistLoader from './views/watchlist-loader.vue';
import WatchlistContextMenu from './components/watchlist-context-menu.vue';
import WatchlistMain from './views/watchlist-main.vue';

const props = defineProps<{
	meta: IMeta;
}>();

const emit = defineEmits<{
	(e: 'delete'): void;
}>();

const sectionsStore = useWatchlistSectionStore();
const tabsStore = useWatchlistTabsStore();

const {
	// tabs,
	columns,
	sections,
} = useWatchlist();

const {
	data: widgetData,
	isLoading: isWidgetLoading,
	isError: isWidgetError,
} = useQueryWatchlistWidget({ market: props.meta.market });

const watchlistDataArgs = computed<IGetWatchlistRequest | null>(() => {
	if (!widgetData.value?.config?.activeTabId) {
		return null;
	};

	return {
		tabId: tabsStore.currentTabId,
	};
});

const { data: tableData, isLoading: isTableLoading, isError: isTableError } = useQueryWatchlistData(
	watchlistDataArgs,
	{ enabled: computed(() => watchlistDataArgs.value !== null) },
);

const loaderRow = computed(() => isWidgetLoading.value ? 6 : 5);
const hasError = computed(() => isWidgetError.value || isTableError.value);

watch(widgetData, newVal => {
	if (newVal && newVal.config) {
		tabsStore.setupTabs(newVal.config);
	}
}, { once: true });

watch(tableData, (newVal) => {
	sectionsStore.setSections((newVal ?? []) as IWatchlistSection[]);
}, { immediate: true });
</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<span>{{ props.meta.name }}</span>
		</template>

		<template #content>
			<watchlist-error v-if="hasError" />

			<watchlist-loader v-if="isWidgetLoading || isTableLoading" :count="loaderRow" />
			<watchlist-main
				v-if="widgetData && tableData && !hasError"
				:columns="columns"
				:sections="sections"
				:tickers="tableData.tickers"
			/>
		</template>

		<template #rcm>
			<watchlist-context-menu :title="props.meta.name" @delete="emit('delete')" />
		</template>
	</base-dashboard-component>
</template>

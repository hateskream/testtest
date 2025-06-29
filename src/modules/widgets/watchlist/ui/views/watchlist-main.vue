<script setup lang="ts">
import { computed, watch } from 'vue';

import { useQueryWatchlistData, useQueryWatchlistWidget } from '../../queries/watchlist.query.ts';
import { useWatchlistStore, useWatchlistTabsStore, useWatchlistSectionStore } from '../../stores';
import type { IWatchlistSection } from '../../model';
import type { IGetWatchlistRequest } from '../../api';
import type { IMeta } from '@/modules/dashboard-group/model';

import WatchlistError from './watchlist-error.vue';
import WatchlistLoader from './watchlist-loader.vue';
import WatchlistTable from '../components/table/watchlist-table.vue';
import WatchlistTabsToolbar from '../components/tabs/watchlist-tabs-toolbar.vue';

const watchlistStore = useWatchlistStore();
const sectionsStore = useWatchlistSectionStore();
const tabsStore = useWatchlistTabsStore();

const props = defineProps<{
	meta: IMeta;
}>();

// eslint-disable-next-line @stylistic/max-len
const { data: widgetData, isLoading: isWidgetLoading, isError: isWidgetError } = useQueryWatchlistWidget({ market: props.meta.market });

const watchlistDataArgs = computed<IGetWatchlistRequest | null>(() => {
	if (!widgetData.value?.config?.activeTabId) {
		return null;
	};

	return {
		sort: watchlistStore.activeTabSort.sortTab,
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
	<div :class="classes.root">
		<watchlist-error v-if="hasError" />

		<watchlist-tabs-toolbar v-if="widgetData && !hasError" />
		<watchlist-table v-if="tableData && !hasError" :watchlist-table="tableData" />

		<watchlist-loader v-if="isWidgetLoading || isTableLoading" :count="loaderRow" />
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 16px 18px;
	overflow: hidden;
}
</style>

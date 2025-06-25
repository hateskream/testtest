<script setup lang="ts">

import { computed, watch } from 'vue';

import { useMarketStore } from '../../../market/stores/index.ts';
import { useQueryWatchlistData } from '../../queries/watchlist.query.ts';
import { useWatchlistSectionStore } from '../../stores/watchlist-section.store.ts';
import { useWatchlistTabsStore } from '../../stores/watchlist-tabs.store.ts';
import type { IWatchlistSection } from '../../model/watchlist.model.ts';
import type { IGetWatchlistRequest } from '../../api/index.ts';

import WatchlistError from './watchlist-error.vue';
import WatchlistLoader from './watchlist-loader.vue';
import WatchlistTable from '../components/table/watchlist-table.vue';
import WatchlistTabsToolbar from '../components/tabs/watchlist-tabs-toolbar.vue';

const marketStore = useMarketStore();
const sectionsStore = useWatchlistSectionStore();
const tabsStore = useWatchlistTabsStore();


const useQueryArgs = computed<IGetWatchlistRequest>(() => ({
	sort: marketStore.activeTabSort.sortTab,
	watchlistIdx: tabsStore.currentTabIdx,
}));
const { data, isLoading, isError } = useQueryWatchlistData(useQueryArgs);

watch(data, (newVal) => {
	sectionsStore.setSections((newVal ?? []) as IWatchlistSection[]);
}, { immediate: true });
</script>

<template>
	<div :class="classes.root">
		<watchlist-tabs-toolbar />

		<watchlist-loader v-if="isLoading" />
		<watchlist-error v-else-if="isError" />
		<watchlist-table v-else-if="data" :watchlist-sections="data" />
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

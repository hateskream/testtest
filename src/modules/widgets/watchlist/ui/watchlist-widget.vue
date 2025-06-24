<script setup lang="ts">
import { computed, watch } from 'vue';

import type { IMeta } from '@/modules/dashboard-group/model';
import { BaseDashboardComponent } from '../../base/index.ts';
import { useMarketStore } from '../../market/stores/index.ts';
import { useQueryWatchlist } from '../queries/watchlist.query.ts';
import { useWatchlistSectionStore } from '../stores/watchlist-section.store.ts';
import { useWatchlistTabsStore } from '../stores/watchlist-tabs.store.ts';
import type { IWatchlistSection } from '../model/watchlist.model.ts';
import type { IGetWatchlistRequest } from '../api/index.ts';

import WatchlistMain from './views/watchlist-main.vue';
import WatchlistError from './views/watchlist-error.vue';
import WatchlistLoader from './views/watchlist-loader.vue';

const props = defineProps<{
	meta: IMeta;
}>();

const marketStore = useMarketStore();
const sectionsStore = useWatchlistSectionStore();
const tabsStore = useWatchlistTabsStore();

const useQueryArgs = computed<IGetWatchlistRequest>(() => ({
	market: props.meta.market,
	sort: marketStore.activeTabSort.sortTab,
	watchlistIdx: tabsStore.currentTabIdx,
}));
const { data, isLoading, isError } = useQueryWatchlist(useQueryArgs);

watch(data, (newVal) => {
	sectionsStore.setSections((newVal ?? []) as IWatchlistSection[]);
}, { immediate: true });

</script>

<template>
	<base-dashboard-component :is-resizing="props.meta.isResizing">
		<template #title>
			<div :class="classes.titleContainer">
				<span>{{ props.meta.name }}</span>
			</div>
		</template>

		<template #content>
			<watchlist-loader v-if="isLoading" />
			<watchlist-error v-else-if="isError" />

			<watchlist-main
				v-else-if="sectionsStore.sections.length > 0"
				:watchlist-data="sectionsStore.sections"
			/>
		</template>
	</base-dashboard-component>
</template>

<style module="classes">
.titleContainer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}
</style>

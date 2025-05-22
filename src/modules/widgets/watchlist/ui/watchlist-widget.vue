<script setup lang="ts">

import type { IMeta } from '@/modules/dashboard-group/model';
import { BaseDashboardComponent } from '../../base/index.ts';
import { useMarketStore } from '../../market/stores/index.ts';
import { useQueryWatchlist } from '../queries/watchlist.query.ts';

import WatchlistMain from './views/watchlist-main.vue';
import WatchlistError from './views/watchlist-error.vue';
import WatchlistLoader from './views/watchlist-loader.vue';

const props = defineProps<{
	meta: IMeta;
}>();

const marketStore = useMarketStore();
const { data, isLoading, isError } = useQueryWatchlist({
	market: props.meta.market,
	sort: marketStore.activeTabSort.sortTab,
});
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

			<watchlist-main v-else :watchlist-data="data || []" />
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

<script setup lang="ts">

import type { IWatchlistSection } from '../../model';

import WatchlistFilterPanel from '../components/filters/watchlist-filters-panel.vue';
import WatchlistTable from '../components/table/watchlist-table.vue';

interface IWatchlistTableProps {
	watchlistData: IWatchlistSection[];
}

const props = defineProps<IWatchlistTableProps>();
</script>

<template>
	<div :class="$style.root">
		<watchlist-filter-panel />
		<watchlist-table :watchlist-sections="props.watchlistData" />
	</div>
</template>

<style module>
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 16px 18px;
	overflow: hidden;
}
</style>

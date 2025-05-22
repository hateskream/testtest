<script setup lang="ts">

import type { IWatchlistSection } from '../../model';

import WatchlistTabsToolbar from '../components/filters/watchlist-tabs-toolbar.vue';
import WatchlistTable from '../components/table/watchlist-table.vue';

interface IWatchlistTableProps {
	watchlistData: IWatchlistSection[];
}

const props = defineProps<IWatchlistTableProps>();
</script>

<template>
	<div :class="classes.root">
		<watchlist-tabs-toolbar />
		<watchlist-table :watchlist-sections="props.watchlistData" />
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

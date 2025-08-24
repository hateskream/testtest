<script setup lang="ts">
import type { TableRow, ITableColumn } from '@/modules/cell';
import type { ISection } from '../../model';

import WatchlistTable from '../components/table/watchlist-table.vue';
import WatchlistTabsToolbar from '../components/tabs/watchlist-tabs-toolbar.vue';

interface IWatchlistMainProps {
	tickers: TableRow[];
	columns: ITableColumn[];
	sections: ISection[];
}

const props = defineProps<IWatchlistMainProps>();
</script>

<template>
	<div :class="classes.root">
		<watchlist-tabs-toolbar />
		<watchlist-table
			:columns="props.columns"
			:sections="props.sections"
			:tickers="props.tickers"
		/>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 16px 18px;
	overflow: hidden;
	gap: 8px;
}
</style>

<script setup lang="ts">
import type { IWatchlistSection } from '../../../model';

import WatchlistTableHeader from './header/watchlist-table-header.vue';
import WatchlistTableSection from './watchlist-table-section.vue';


interface IWatchlistTableProps {
	watchlistSections: IWatchlistSection[];
}

const props = defineProps<IWatchlistTableProps>();

</script>

<template>
	<div :class="classes.watchlistTable">
		<watchlist-table-header :class="classes.tableHeader" />

		<watchlist-table-section :watchlist-sections="props.watchlistSections" />
	</div>
</template>

<style module="classes">
.watchlistTable {
	position: relative;
	flex: 1;
	overflow-x: auto;
	overflow-y: auto;
}

.tableHeader {
	position: relative;
	z-index: 21;
	flex: 1;
}
</style>

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
	<watchlist-table-header :class="classes.tableHeader" />

	<div :class="classes.watchlistTable">
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
	z-index: 101;
}
</style>

<script setup lang="ts">
import type { IWatchlistSection } from '../../../model';
import { useResizeBackground } from '@/modules/widgets/base/common/composables/use-resize-background';

import WatchlistTableHeader from './header/watchlist-table-header.vue';
import WatchlistTableSection from './watchlist-table-section.vue';


interface IWatchlistTableProps {
	watchlistSections: IWatchlistSection[];
}

const props = defineProps<IWatchlistTableProps>();

const { backgroundStyle } = useResizeBackground();
</script>

<template>
	<div :class="classes.watchlistTable">
		<watchlist-table-header :class="classes.tableHeader"  :style="backgroundStyle" />

		<watchlist-table-section :watchlist-sections="props.watchlistSections" />
	</div>
</template>

<style module="classes">
.watchlistTable {
	position: relative;
	z-index: 1;
	flex: 1;
	overflow-x: auto;
	overflow-y: auto;
}

.tableHeader {
	position: sticky;
	top: 0;
	z-index: 21;
	flex: 1;
}
</style>

<script setup lang="ts">
import type { IWatchlistSection } from '../../../model';
import { useResizeBackground } from '@/modules/widgets/base/common/composables/use-resize-background';

import WatchlistTableHeader from './header/watchlist-table-header.vue';
import WatchlistTableSection from './watchlist-table-section.vue';
import watchlistEmptyState from '../watchlist-empty-state.vue';


interface IWatchlistTableProps {
	watchlistSections: IWatchlistSection[];
}

const props = defineProps<IWatchlistTableProps>();

const { backgroundStyle } = useResizeBackground();
</script>

<template>
	<div :class="classes.watchlistTable">
		<template v-if="props.watchlistSections.length > 0">
			<watchlist-table-header :class="classes.tableHeader" :style="backgroundStyle" />
			<watchlist-table-section :watchlist-sections="props.watchlistSections" />
		</template>

		<watchlist-empty-state v-else :class="classes.emptyState" />
	</div>
</template>

<style module="classes">
.watchlistTable {
	position: relative;
	z-index: 1;
	flex: 1;
	padding: 0 6px 6px;
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

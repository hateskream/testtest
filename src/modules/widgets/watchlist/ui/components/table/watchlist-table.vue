<script setup lang="ts">
import { watch } from 'vue';

import type { IWatchlistTable } from '../../../model';
import { useResizeBackground } from '@/modules/widgets/base/common/composables/use-resize-background';
import { useWatchlistSectionStore } from '../../../stores';

import WatchlistTableHeader from './header/watchlist-table-header.vue';
import WatchlistTableSection from './watchlist-table-section.vue';
import watchlistEmptyState from '../watchlist-empty-state.vue';


interface IWatchlistTableProps {
	watchlistTable: IWatchlistTable;
}

const props = defineProps<IWatchlistTableProps>();

const { backgroundStyle } = useResizeBackground();
const watchlistSectionStore = useWatchlistSectionStore();

// Синхронизируем секции из API с store
watch(() => props.watchlistTable.sections, (newSections) => {
	watchlistSectionStore.setSections(newSections);
}, { immediate: true, deep: true });
</script>

<template>
	<div :class="classes.watchlistTable">
		<template v-if="props.watchlistTable.sections.length > 0">
			<watchlist-table-header
				:class="classes.tableHeader"
				:style="backgroundStyle"
				:columns="props.watchlistTable.columns"
				:ticker-state="props.watchlistTable.tickerState"
			/>
			<watchlist-table-section
				:watchlist-sections="props.watchlistTable.sections"
				:columns="props.watchlistTable.columns"
				:ticker-state="props.watchlistTable.tickerState"
			/>
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

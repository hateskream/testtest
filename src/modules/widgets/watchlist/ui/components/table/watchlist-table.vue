<script setup lang="ts">
import type { IWatchlistSection } from '../../../model';

import TableHeader from './header/table-header.vue';
import WatchlistTableSection from './watchlist-table-section.vue';


interface IWatchlistTableProps {
	watchlistSections: IWatchlistSection[];
}

const props = defineProps<IWatchlistTableProps>();

</script>

<template>
	<div :class="classes.watchlistTable">
		<!-- Заголовки таблицы -->
		<table-header />
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
</style>

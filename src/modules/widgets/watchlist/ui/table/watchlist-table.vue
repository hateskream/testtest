<script setup lang="ts">
import { computed } from 'vue';

import { type ITickerAction, mapSections, type ISectionUi } from '../../model';
import { mapColumn, type ITableColumn, type TableRow } from '@/modules/cell';

import WatchlistEmptyState from './watchlist-empty-state.vue';
import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';

interface IWatchlistTableProps {
	tickers: TableRow[];
	columns: ITableColumn[];
	sections: ISectionUi[];
}

const props = defineProps<IWatchlistTableProps>();

const emit = defineEmits<{
	(event: 'add-ticker', payload: ITickerAction): void;
	(event: 'remove-ticker', payload: ITickerAction): void;
}>();

const genericColumns = computed(() => mapColumn(props.columns));

const genericSections = computed(() => mapSections(props.sections, props.tickers));
</script>

<template>
	<div :class="classes.watchlistTable">
		<widget-typed-table
			v-if="genericSections.length > 0"
			:sections="genericSections"
			:columns="genericColumns"
			:enable-drag-drop="true"
			:enable-column-reordering="true"
			:enable-sorting="false"
			:enable-column-settings="true"
			:sticky-header="true"
			:sticky-first-column="true"
			:enable-row-actions="false"
			:show-header="true"
		/>
		<watchlist-empty-state
			v-else
			@add-ticker="emit('add-ticker', $event)"
			@remove-ticker="emit('remove-ticker', $event)"
		/>
	</div>
</template>

<style module="classes">
.watchlistTable {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
</style>

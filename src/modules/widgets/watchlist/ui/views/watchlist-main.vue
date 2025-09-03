<script setup lang="ts">
import type { TableRow, ITableColumn } from '@/modules/cell';
import type { ISection, ITab, ITickerAction } from '../../model';

import WatchlistTable from '../table/watchlist-table.vue';
import WatchlistTabsToolbar from '../tabs/watchlist-tabs-toolbar.vue';

interface IWatchlistMainProps {
	tickers: TableRow[];
	columns: ITableColumn[];
	sections: ISection[];
	tabs: ITab[];
}

const props = defineProps<IWatchlistMainProps>();

const emit = defineEmits<{
	(event: 'add-tab'): void;
	(event: 'switch-tab', id: string): void;
	(event: 'rename-tab', id: string, name: string): void;
	(event: 'duplicate-tab', id: string): void;
	(event: 'add-ticker', payload: ITickerAction): void;
	(event: 'remove-ticker', payload: ITickerAction): void;
	(event: 'delete-tab', id: string): void;
}>();

function onRenameTab(id: string, name: string) {
	emit('rename-tab', id, name);
}
</script>

<template>
	<div :class="classes.root">
		<watchlist-tabs-toolbar
			:tabs="props.tabs"
			@add-tab="emit('add-tab')"
			@rename-tab="onRenameTab"
			@switch-tab="emit('switch-tab', $event)"
			@duplicate-tab="emit('duplicate-tab', $event)"
			@delete-tab="emit('delete-tab', $event)"
		/>
		<watchlist-table
			:columns="props.columns"
			:sections="props.sections"
			:tickers="props.tickers"
			@add-ticker="emit('add-ticker', $event)"
			@remove-ticker="emit('remove-ticker', $event)"
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

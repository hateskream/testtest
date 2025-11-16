<script setup lang="ts">
import type { ITableColumn, TableRow } from '@/modules/cell';
import type { ISectionUi, ITab, ITickerAddPayload, ITickerRemovePayload, ITickersAddPayload } from '../../model';
import { IconIds, UiIcon } from '@/shared/ui/icon';

import WatchlistTable from '../table/watchlist-table.vue';
import WatchlistTabsToolbar from '../tabs/watchlist-tabs-toolbar.vue';

interface IWatchlistMainProps {
	selectedTickers: string[];
	tickers: TableRow[];
	columns: ITableColumn[];
	sections: ISectionUi[];
	tabs: ITab[];
}

const props = defineProps<IWatchlistMainProps>();

const emit = defineEmits<{
	(event: 'add-tab'): void;
	(event: 'switch-tab', id: string): void;
	(event: 'rename-tab', id: string, name: string): void;
	(event: 'duplicate-tab', id: string): void;
	(event: 'add-ticker', payload: ITickerAddPayload): void;
	(event: 'remove-ticker', payload: ITickerRemovePayload): void;
	(event: 'delete-tab', id: string): void;
	(event: 'create-new-watchlist'): void;
	(event: 'add-tickers', payload: ITickersAddPayload): void;
	(event: 'remove-section', id: string): void;
}>();

function onRenameTab(id: string, name: string) {
	emit('rename-tab', id, name);
}
</script>

<template>
	<div :class="classes.root">
		<template v-if="props.tabs.length">
			<watchlist-tabs-toolbar
				:selected-tickers="props.selectedTickers"
				:tabs="props.tabs"
				display-variant="default"
				@remove-ticker="emit('remove-ticker', $event)"
				@add-tab="emit('add-tab')"
				@rename-tab="onRenameTab"
				@switch-tab="emit('switch-tab', $event)"
				@duplicate-tab="emit('duplicate-tab', $event)"
				@delete-tab="emit('delete-tab', $event)"
				@add-ticker="emit('add-ticker', $event)"
			/>
			<watchlist-table
				:columns="props.columns"
				:sections="props.sections"
				:tickers="props.tickers"
				:selected-tickers="props.selectedTickers"
				display-variant="default"
				@add-ticker="emit('add-ticker', $event)"
				@remove-ticker="emit('remove-ticker', $event)"
				@add-tickers="emit('add-tickers', $event)"
				@remove-section="emit('remove-section', $event)"
			/>
		</template>
		<template v-else>
			<div :class="classes.empty">
				<ui-icon
					:id="IconIds.EmptyWatchlist"
					height="70px"
					width="80px"
				/>

				<div :class="classes.info">
					<div :class="classes.heading">
						Create your watchlist
					</div>

					<div :class="classes.button" @click="emit('create-new-watchlist')">
						Create
					</div>
				</div>
			</div>
		</template>
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

.empty {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	border: 1px solid var(--color-border-surface-02, rgb(199 199 199 / 10%));
	border-radius: 18px;
	gap: 12px;
}

.info {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8px;
}

.heading {
	font-weight: 300;
	font-size: var(--typography-headers-size-h-01);
	text-align: center;
	color: #ffffff;
	letter-spacing: 0.104px;
}

.button {
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	height: 42px;
	padding: 10px 18px;
	font-weight: 300;
	font-size: 13px;
	line-height: 170%;
	color: #adadad;
	letter-spacing: 0.8%;
	background-color: var(--bg-color-base-300);
	border-radius: 42px;
	cursor: pointer;
	gap: 10px;
}

.button:hover {
	color: #ffffff;
	background-color: rgb(51 51 51 / 80%);
}
</style>

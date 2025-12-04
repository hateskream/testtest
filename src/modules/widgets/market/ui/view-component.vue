<script setup lang="ts">
import type { FiltersState, FiltersValues, IWatchlistAction } from '../model';
import type { ITableColumn, TableRow } from '@/modules/cell';
import type { MarketType } from '@/modules/market';
import type { IWatchlistData } from '@/modules/watchlist';

import MarketTabsComponent from './market-tabs-component.vue';
import MarketTableComponent from './market-table-component.vue';

interface IViewComponentProps {
	displayVariant: 'default' | 'new';
	rows: TableRow[];
	filtersValues: FiltersValues;
	watchlists: IWatchlistData[];
}

const props = defineProps<IViewComponentProps>();

const emits = defineEmits<{
	(e: 'add-to-watchlist', watchlists: IWatchlistAction): void;
	(e: 'remove-from-watchlist', watchlists: IWatchlistAction): void;
	(e: 'add-to-new-watchlist', tickerId: string): void;
}>();

const market = defineModel<MarketType>('market', { required: true });
const filters = defineModel<FiltersState>('filters', { required: true });
const columns = defineModel<ITableColumn[]>('columns', { required: true });
</script>

<template>
	<div :class="classes.root">
		<market-tabs-component
			v-model:filters="filters"
			v-model:market="market"
			v-model:columns="columns"
			:filters-values="props.filtersValues"
			:display-variant
		/>
		<market-table-component
			v-model:columns="columns"
			:rows="props.rows"
			:watchlists="props.watchlists"
			@add-to-watchlist="emits('add-to-watchlist', $event)"
			@remove-from-watchlist="emits('remove-from-watchlist', $event)"
			@add-to-new-watchlist="emits('add-to-new-watchlist', $event)"
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
}
</style>

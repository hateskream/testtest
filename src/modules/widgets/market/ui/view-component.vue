<script setup lang="ts">
import type { FiltersState, FiltersValues, ITableColumn } from '../model';
import type { TableRow } from '@/modules/cell';
import type { MarketType } from '@/modules/market';

import MarketTabsComponent from './market-tabs-component.vue';
import MarketTableComponent from './market-table-component.vue';

interface IViewComponentProps {
	rows: TableRow[];
	filtersValues: FiltersValues;
}

const props = defineProps<IViewComponentProps>();

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
		/>
		<market-table-component
			v-model:columns="columns"
			:rows="props.rows"
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

<script setup lang="ts">


import { MarketType } from '@/modules/market';
import type { ITableColumn, TableRow } from '@/modules/cell';

import ExchangesTabsComponent from './exchanges-tabs-component.vue';
import ExchangesTableComponent from './exchanges-table-component.vue';

interface IViewComponentProps {
	rows: TableRow[];
}

const props = defineProps<IViewComponentProps>();


const market = defineModel<MarketType>('market', { required: true });
const columns = defineModel<ITableColumn[]>('columns', { required: true });
const cexDex = defineModel<'CEX' | 'DEX'>('cexDex', { required: true });

</script>

<template>
	<div :class="classes.root">
		<exchanges-tabs-component
			v-model:market="market"
			v-model:columns="columns"
			v-model:cex-dex="cexDex"
		/>
		<exchanges-table-component
			v-model:columns="columns"
			:rows="props.rows"
			:market="market"
			:cex-dex="cexDex"
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

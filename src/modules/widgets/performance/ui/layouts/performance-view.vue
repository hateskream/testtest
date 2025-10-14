<script setup lang="ts">
import type { ITableColumn } from '@/modules/cell';
import type {
	DisplayVariant,
	Stock,
	PerformanceTableRow,
	DateRange,
	SymbolDisplayVariant,
	Currency,
} from '../../model';
import type { MarketType } from '@/modules/market';

import PerformanceHeader from '../header/performance-header.vue';
import PerformanceTable from '../table/performance-table.vue';

interface IViewComponentProps {
	rows: PerformanceTableRow[];
	columns: ITableColumn[];
}

const props = defineProps<IViewComponentProps>();

const stock = defineModel<Stock>('stock');
const date = defineModel<DateRange>('date', { required: true });
const symbolDisplayVariant = defineModel<SymbolDisplayVariant>('symbolDisplay');
const quoteCurrency = defineModel<Currency>('quoteCurrency');

const activeMarket = defineModel<MarketType>('activeMarket', { required: true });
const displayVariant = defineModel<DisplayVariant>('displayVariant', { required: true });
const isCompactMode = defineModel<boolean>('isCompactMode', { required: true });
</script>

<template>
	<div :class="classes.performanceView">
		<performance-header
			v-model:active-market="activeMarket"
			v-model:is-compact-mode="isCompactMode"
			v-model:display-variant="displayVariant"
			v-model:stock="stock"
			v-model:date="date"
			v-model:quote-currency="quoteCurrency"
			v-model:symbol-display="symbolDisplayVariant"
		/>

		<div :class="classes.performanceContent">
			<performance-table
				:rows="props.rows"
				:columns="props.columns"
				:display-variant="displayVariant"
			/>
		</div>
	</div>
</template>

<style module="classes">
.performanceView {
	display: flex;
	flex-direction: column;
	gap: 8px;
	height: 100%;
	overflow: hidden;
}

.performanceContent {
	flex: 1;
	overflow: hidden;
}
</style>

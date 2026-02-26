<script setup lang="ts">
import type { ITableColumn } from '@/modules/cell';
import type { DisplayVariant, PerformanceMarketType, PerformanceTableRow } from '../../model';
import { MarketType } from '@/modules/market';

import PerformanceTable from '../table/performance-table.vue';

interface IViewComponentProps {
	rows: PerformanceTableRow[];
	columns: ITableColumn[];
	activeMarket: PerformanceMarketType;
}

const props = defineProps<IViewComponentProps>();

const displayVariant = defineModel<DisplayVariant>('displayVariant', { required: true });
</script>

<template>
	<div :class="classes.performanceContent">
		<performance-table
			:rows="props.rows"
			:columns="props.columns"
			:display-variant="displayVariant"
			:enable-ticker-click="props.activeMarket === MarketType.Forex"
		/>
	</div>
</template>

<style module="classes">
.performanceContent {
	flex: 1;
}
</style>

<script setup lang="ts">
import type { ITableColumn } from '@/modules/cell';
import type { DisplayVariant, Stock, DateRange, PerformanceTableRow } from '../../model';

import PerformanceHeader from '../header/performance-header.vue';
import PerformanceTable from '../table/performance-table.vue';

interface IViewComponentProps {
	rows: PerformanceTableRow[];
	columns: ITableColumn[];
}

const props = defineProps<IViewComponentProps>();

const displayVariant = defineModel<DisplayVariant>('displayVariant', { required: true });
const stock = defineModel<Stock>('stock', { required: true });
const date = defineModel<DateRange>('date', { required: true });
const isCompactMode = defineModel<boolean>('isCompactMode', { required: true });
</script>

<template>
	<div :class="classes.performanceView">
		<performance-header
			v-model:is-compact-mode="isCompactMode"
			v-model:display-variant="displayVariant"
			v-model:stock="stock"
			v-model:date="date"
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

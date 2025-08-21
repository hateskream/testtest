<script setup lang="ts">
import type { ITableColumn, TableRow } from '@/modules/cell';

import PerformanceHeader from '../header/performance-header.vue';
import PerformanceTable from '../table/performance-table.vue';

interface IViewComponentProps {
	rows: TableRow[];
	columns: ITableColumn[];
}

const props = defineProps<IViewComponentProps>();
</script>

<template>
	<div :class="classes.performanceView">
		<performance-header />

		<div :class="classes.performanceContent">
			<performance-table
				:rows="props.rows"
				:columns="props.columns"
			/>
		</div>
	</div>
</template>

<style module="classes">
.performanceView {
	display: flex;
	flex-direction: column;
	height: 100%;
	overflow: hidden;
}

.performanceContent {
	flex: 1;
	overflow: hidden;
}
</style>

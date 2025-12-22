<script setup lang="ts">
import type { ITableColumn } from '@/modules/cell';
import type {
	DisplayVariant,

	PerformanceTableRow,

} from '../../model';


import PerformanceTable from '../table/performance-table.vue';

interface IViewComponentProps {
	rows: PerformanceTableRow[];
	columns: ITableColumn[];
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
		/>
	</div>
</template>

<style module="classes">
.performanceContent {
	flex: 1;
}
</style>

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
	<div :class="classes.performanceView">


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

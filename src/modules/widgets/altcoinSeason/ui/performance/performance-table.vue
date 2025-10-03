<script setup lang="ts">
import { computed } from 'vue';

import { WidgetTypedTable } from '@/modules/widgets/widget-table';
import { type PerformanceTableRow } from '../../model';
import { ColumnType, type ITableColumn, mapColumn, mapRow } from '@/modules/cell';
import { useGoToTickerPage } from '@/modules/chart';

interface IPerformanceTableProps {
	rows: PerformanceTableRow[];
	columns: ITableColumn[];
}

const props = defineProps<IPerformanceTableProps>();

const { goToTickerPage } = useGoToTickerPage();

const genericColumns = computed(() =>
	mapColumn(props.columns),
);

const genericRows = computed(() =>
	props.rows.map(ticker => {
		const percent = { ...ticker[ColumnType.ChangePrice24hPercent] };

		return mapRow({
			...ticker,
			[ColumnType.ChangePrice24hPercent]: percent,
		});
	}),
);
</script>

<template>
	<div :class="classes.root">
		<div :class="classes.scrollable">
			<widget-typed-table
				:columns="genericColumns"
				:rows="genericRows"
				:enable-drag-drop="false"
				:enable-column-reordering="true"
				:enable-sorting="false"
				:enable-column-settings="false"
				:sticky-header="true"
				:sticky-first-column="true"
				:enable-row-actions="false"
				:show-header="true"
				@click-on-ticker="goToTickerPage"
			/>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 16px 18px;
	overflow: hidden;
	background: none;
}

.scrollable {
	position: relative;
	height: 100%;
	overflow: auto;
}
</style>

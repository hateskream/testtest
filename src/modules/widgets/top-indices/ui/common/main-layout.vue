<script setup lang="ts">
import { computed } from 'vue';

import { mapColumn, mapRow, type ITableColumn, type TableRow } from '@/modules/cell';
import { useGoToTickerPage } from '@/modules/chart';
import type { IMeta } from '@/modules/dashboard-group';
import { WidgetTypedTable } from '@/modules/widgets/widget-table';

interface IViewComponentProps {
	rows: TableRow[];
	columns: ITableColumn[];
	displayVariant: 'tv' | 'dashboard';
	meta?: IMeta;
}

const props = defineProps<IViewComponentProps>();

const { goToTickerPage } = useGoToTickerPage();

const genericColumns = computed(() => {
	const columns = mapColumn(props.columns);
	columns[0].minWidth = 200;
	return columns;

},
);

const genericRows = computed(() =>
	props.rows.map((row) => mapRow(row)),
);
</script>

<template>
	<div
		:class="classes.root"
		:style="{
			padding: displayVariant === 'dashboard' ? '12px 10px' : '0 16px 18px',
		}"
	>
		<div :class="classes.scrollable">
			<widget-typed-table
				:columns="genericColumns"
				:rows="genericRows"
				:enable-drag-drop="false"
				:enable-column-reordering="true"
				:enable-sorting="false"
				:enable-column-settings="true"
				:sticky-header="true"
				:sticky-first-column="true"
				:enable-row-actions="false"
				:show-header="false"
				:hide-description="false"
				no-vertical-scroll
				@click-on-ticker="goToTickerPage"
			/>
		</div>
	</div>
</template>

<style module="classes">
.root {
	display: flex;
	flex-grow: 1;
	flex-direction: column;
}

.scrollable {
	position: relative;
	flex-grow: 1;
	height: 100%;
	min-height: 0;
	overflow: auto;
}
</style>

<script setup lang="ts">
import { computed } from 'vue';

import { mapColumn, mapRow, type ITableColumn, type TableRow } from '@/modules/cell';
import { useGoToTickerPage } from '@/modules/chart';

import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';

interface IViewComponentProps {
	rows: TableRow[];
	columns: ITableColumn[];
	isFixedWidth: boolean;
}

const props = defineProps<IViewComponentProps>();

const { goToTickerPage } = useGoToTickerPage();

const genericColumns = computed(() =>
	mapColumn(props.columns),
);

const genericRows = computed(() =>
	props.rows.map(ticker => mapRow(ticker)),
);
</script>

<template>
	<div :class="classes.root">

		<div :class="classes.scrollable">
			<widget-typed-table
				:columns="genericColumns"
				:is-fixed-width="isFixedWidth"
				:rows="genericRows"
				:enable-drag-drop="false"
				:enable-column-reordering="true"
				:enable-sorting="false"
				:enable-column-settings="true"
				:sticky-header="true"
				:sticky-first-column="true"
				:enable-row-actions="false"
				:show-header="false"
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
}


.scrollable {
	position: relative;
	height: 100%;
	min-height: 0;
	overflow: auto;
}
</style>

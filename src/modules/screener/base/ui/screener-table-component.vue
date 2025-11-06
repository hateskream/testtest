<script setup lang="ts">
import { computed } from 'vue';

import { type ITableColumn, mapColumn, mapRow, type TableRow } from '@/modules/cell';
import { useGoToTickerPage } from '@/modules/chart';
import { WidgetTypedTable } from '@/modules/widgets/widget-table';

interface IViewComponentProps {
	rows: TableRow[];
}

const props = defineProps<IViewComponentProps>();

const columns = defineModel<ITableColumn[]>('columns', { required: true });

const { goToTickerPage } = useGoToTickerPage();

const genericColumns = computed(() =>
	mapColumn(columns.value),
);

const genericRows = computed(() =>
	props.rows.map(ticker => mapRow(ticker)),
);
</script>

<template>
	<div :class="classes.scrollable">
		<widget-typed-table
			:columns="genericColumns"
			:rows="genericRows"
			:enable-drag-drop="true"
			:enable-column-reordering="true"
			:enable-sorting="false"
			:enable-column-settings="true"
			:sticky-header="true"
			:sticky-first-column="true"
			:enable-row-actions="true"
			:show-header="true"
			@click-on-ticker="goToTickerPage"
		/>
	</div>
</template>

<style module="classes">
.scrollable {
	position: relative;
	height: 100%;
}
</style>

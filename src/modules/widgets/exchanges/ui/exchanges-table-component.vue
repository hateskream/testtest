<script setup lang="ts">
import { computed } from 'vue';

import { WidgetTypedTable } from '@/modules/widgets/widget-table';
import { type ITableColumn, mapColumn, mapRow, type TableRow } from '@/modules/cell';


export interface IViewComponentProps {
	cexDex: 'CEX' | 'DEX';
	market?: string;
	rows: TableRow[];
}

const props = defineProps<IViewComponentProps>();
const columns = defineModel<ITableColumn[]>('columns', { required: true });

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
		/>
	</div>
</template>

<style module="classes">
.scrollable {
	position: relative;
	height: 100%;
	min-height: 0;
}

.favorite {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 20px;
	height: 20px;
	color: var(--text-color-base-300);
	cursor: pointer;
	transition: color 0.2s ease-in;

	&:hover {
		color: var(--text-color-base-300-effect);
	}
}

.new {
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
}
</style>

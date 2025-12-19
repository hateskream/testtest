<script setup lang="ts">
import { computed } from 'vue';

import { mapColumn, type ITableColumn, type TableRow } from '@/modules/cell';
import { useGoToTickerPage } from '@/modules/chart';
import { mockIndexData } from './mock-index-data.ts';
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

const genericColumns = computed(() =>
	mapColumn(props.columns),
);

const genericRows = computed(() => {
	const source = mockIndexData;
	const limit = props?.meta?.maxCountRowTable ?? 100;

	if (!Array.isArray(source) || source.length === 0) {
		return [];
	}

	const result = [];

	for (let i = 0; i < limit; i++) {
		result.push(source[i % source.length]);
	}

	return result;
});
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

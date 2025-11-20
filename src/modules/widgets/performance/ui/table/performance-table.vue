<script setup lang="ts">
import { computed } from 'vue';

import { ColumnType, mapColumn, mapRow, type ITableColumn } from '@/modules/cell';
import { DisplayVariant, type PerformanceTableRow } from '../../model';
import { useGoToTickerPage } from '@/modules/chart';
import { IconIds, UiIcon } from '@/shared/ui/icon';
import { mockedSectorRows } from '@/modules/widgets/performance/ui/table/mocked-sector-data.ts';

import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';


interface IPerformanceTableProps {
	rows: PerformanceTableRow[];
	columns: ITableColumn[];
	displayVariant: DisplayVariant;
}

const props = defineProps<IPerformanceTableProps>();

const { goToTickerPage } = useGoToTickerPage();


// Создаем мутированные данные на основе props.rows и mockedSectorRows
const mutatedRowData = computed(() => {
	return mockedSectorRows.map((mockedRow, index) => {
		const originalRow = props.rows[index % props.rows.length] || props.rows[0];

		return {
			...originalRow,
			tickerId: mockedRow.tickerId,
			symbol: mockedRow.symbol,
			changePrice24hPercent: mockedRow.changePrice24hPercent,
		} as PerformanceTableRow;
	});
});

const genericColumns = computed(() =>
	mapColumn(props.columns),
);

const maxAbsValue = computed(() => {
	if (props.displayVariant === DisplayVariant.List) {
		return undefined;
	}
	return 20;
});


const genericRows = computed(() => {
	return mutatedRowData.value.map(ticker => {
		const percent = { ...ticker[ColumnType.ChangePrice24hPercent] };

		if (props.displayVariant === DisplayVariant.List) {
			percent.maxAbsValue = undefined;
		} else {
			percent.maxAbsValue = maxAbsValue.value;
		}


		return mapRow({
			...ticker,
			[ColumnType.ChangePrice24hPercent]: percent,
		});
	});
});

const emit = defineEmits<{
	(e: 'togglePin', tickerId: string): void;
}>();

</script>

<template>
	<div :class="classes.root">
		<div :class="classes.scrollable">
			<widget-typed-table
				:columns="genericColumns"
				:rows="genericRows"
				:ticker-state="{isShowTicker:true, isShowDescription: true, isShowLogo: false}"
				:show-header="false"
				:enable-drag-drop="false"
				:enable-column-reordering="true"
				:enable-sorting="false"
				:enable-column-settings="false"
				:sticky-header="true"
				:sticky-first-column="true"
				:enable-row-actions="false"
				@click-on-ticker="goToTickerPage"
			>
				<template #row-actions="{tickerId} : {tickerId: string}">
					<div
						@click="emit('togglePin', tickerId)"
					>
						<ui-icon
							:id="IconIds.Pin"
							:width="20"
							:height="20"
						/>
					</div>
				</template>
			</widget-typed-table>
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

<style scoped>
:deep(.percentCell) {
	padding-right: 24px;
}

:deep(.symbolCellText) {
	font-size: var(--typography-paragraph-size-p-01);
}

:deep(th:last-child) {
	padding-right: 24px;
}
</style>

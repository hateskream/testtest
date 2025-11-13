<script setup lang="ts">
import { computed } from 'vue';

import { ColumnType, mapColumn, mapRow, type ITableColumn } from '@/modules/cell';
import { DisplayVariant, type PerformanceTableRow } from '../../model';
import { useGoToTickerPage } from '@/modules/chart';

import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';


interface IPerformanceTableProps {
	rows: PerformanceTableRow[];
	columns: ITableColumn[];
	displayVariant: DisplayVariant;
}

const props = defineProps<IPerformanceTableProps>();

const { goToTickerPage } = useGoToTickerPage();

// Функция для генерации случайного процента от -100 до 100
const getRandomPercent = () => {
	return (Math.random() * 200 - 100).toFixed(2);
};

const genericColumns = computed(() =>
	mapColumn(props.columns),
);

const maxAbsValue = computed(() => {
	if (props.displayVariant === DisplayVariant.List) {
		return undefined;
	}
	// Для простоты устанавливаем maxAbsValue в 100
	return 100;
});

const genericRows = computed(() =>
	props.rows.map(ticker => {
		const percent = { ...ticker[ColumnType.ChangePrice24hPercent] };

		if (props.displayVariant === DisplayVariant.List) {
			percent.maxAbsValue = undefined;
		} else {
			percent.maxAbsValue = maxAbsValue.value;
		}

		// Мокаем случайное значение процента
		percent.value = getRandomPercent();

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
				:show-header="false"
				:enable-drag-drop="false"
				:enable-column-reordering="true"
				:enable-sorting="false"
				:enable-column-settings="false"
				:sticky-header="true"
				:sticky-first-column="true"
				:enable-row-actions="false"
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

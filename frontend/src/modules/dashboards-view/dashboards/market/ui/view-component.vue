<script setup lang="ts">
import { computed, toValue } from 'vue';

import { compareStrings } from '@/shared/lib';
import { useMarketStore } from '../stores';
import type { ITableRow, ITableRowValue, ITableRowValueType } from '../model';
import type { IMarketDomain } from '../api';

import MarketTabsComponent from './market-tabs-component.vue';
import TableRowsComponent from './table-rows-component.vue';
import TableColumnsComponent from './table-columns-component.vue';
import TableMetricsComponent from './table-metrics-component.vue';

interface IViewComponentProps {
	markets: IMarketDomain[];
}

const props = defineProps<IViewComponentProps>();

const marketStore = useMarketStore();

const tableRows = computed<ITableRow[][]>(() => {
	const rows: ITableRow[][] = [];
	let tempRow: ITableRow[] = [];

	props.markets.forEach(row => {
		marketStore.activeTableColumns.forEach(column => {
			tempRow.push({
				type: column.type,
				srcValue: row.srcValue,
				value: row[column.columnName],
				id: row.id,
			});
		});

		rows.push(tempRow);

		tempRow = [];
	});

	if (marketStore.activeSort.direction !== 0) {
		const activeSortColumn = marketStore.activeTableColumns.find(column =>
			compareStrings(toValue(marketStore.activeSort.columnName), column.columnName),
		)!;

		rows.sort((a, b) => {
			let leftValue = a[activeSortColumn.position].value;
			let rightValue = b[activeSortColumn.position].value;

			if (marketStore.activeSort.direction === -1) {
				leftValue = b[activeSortColumn.position].value;
				rightValue = a[activeSortColumn.position].value;
			}

			return sortRowsByType({
				left: leftValue,
				right: rightValue,
				type: activeSortColumn.type,
			});
		});
	}

	return rows;
});

function sortRowsByType(args: {
	left: ITableRowValue;
	right: ITableRowValue;
	type: ITableRowValueType;
}) {
	switch (args.type) {
		case 'date':
			return new Date(args.left).getTime() - new Date(args.right).getTime();

		case 'string':
		case 'image-string':
			return args.left.localeCompare(args.right);

		default:
			return +args.left - +args.right;
	}
}
</script>

<template>
	<div :class="classes.tableContainer">
		<market-tabs-component />

		<div :class="classes.tableWrapper">
			<div :class="classes.scrollContainer">
				<table :class="classes.table">
					<table-columns-component />
					<table-rows-component :rows="tableRows" />
				</table>
			</div>
			<table-metrics-component />
		</div>
	</div>
</template>

<style module="classes">
.tableContainer {
	position: relative;
	padding: 0 16px 18px;
}

.tableWrapper {
	position: relative;
	width: 100%;
}

.scrollContainer {
	position: relative;
	max-width: 100%;
	overflow-x: auto;
	-webkit-overflow-scrolling: touch;
	clip-path: inset(0 0 0 0);
}

.table {
	position: relative;
	z-index: 1;
	width: max-content;
	min-width: 100%;
	border-spacing: 0;
}
</style>

<script setup lang="ts">
import { computed, toValue } from 'vue';

import { compareStrings } from '@/shared/lib';
import { useMarketStore } from '../stores';
import type { ITableRow, ITableRowValue, ITableRowValueType, IMarket } from '../model';

import MarketTabsComponent from './market-tabs-component.vue';
import TableRowsComponent from './table-rows-component.vue';
import TableColumnsComponent from './table-columns-component.vue';

interface IViewComponentProps {
	markets: IMarket[];
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
				value: row[column.columnName],
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

		<table :class="classes.table">
			<table-columns-component />
			<table-rows-component :rows="tableRows" />
		</table>
	</div>
</template>

<style module="classes">
.tableContainer {
	padding: 0 16px 18px;
}

.table {
	width: 100%;
}
</style>

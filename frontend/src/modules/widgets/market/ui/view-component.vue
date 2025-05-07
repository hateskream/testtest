<script setup lang="ts">
import { computed, toValue } from 'vue';

import { compareStrings } from '@/shared/lib';
import { useMarketStore } from '../stores';
import type { ITableRow, ITableRowValue, ITableRowValueType } from '../model';
import type { IMarketDomain } from '../api';

import MarketTabsComponent from './market-tabs-component.vue';
import TableRowsComponent from './table-rows-component.vue';
import TableColumnsComponent from './table-columns-component.vue';

interface IViewComponentProps {
	markets: IMarketDomain[];
}

const props = defineProps<IViewComponentProps>();

const marketStore = useMarketStore();

const tableRows = computed<ITableRow[][]>(() => {
	const rows: ITableRow[][] = [];

	props.markets.forEach(row => {
		if (marketStore.isFavorites) {
			if (marketStore.favorites.includes(row.id)) {
				rows.push(prepareRow(row));
			}
		} else {
			rows.push(prepareRow(row));
		}
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

function prepareRow(row: IMarketDomain) {
	const data: ITableRow[] = [];

	marketStore.activeTableColumns.forEach(column => {
		data.push({
			type: column.type,
			srcValue: row.srcValue,
			value: row[column.columnName],
			id: row.id,
		});
	});

	return data;
}

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
	<div :class="classes.root">
		<market-tabs-component />

		<div :class="classes.scrollable">
			<table :class="classes.table">
				<table-columns-component :class="classes.tableThead" />
				<table-rows-component :rows="tableRows" />
			</table>
		</div>
	</div>
</template>

<style module="classes">
.scrollable {
	position: relative;
	flex: 1;
	overflow-x: auto;
	overflow-y: auto;
}

.tableThead {
	position: sticky;
	top: 0;
	z-index: 20;
	background-color: var(--bg-color-surface-01);
}

.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 16px 18px;
	overflow: hidden;
}

.table {
	position: relative;
	width: max-content;
	min-width: 100%;
	border-spacing: 0;
}
</style>

<script setup lang="ts">
import { ref, computed, toValue } from 'vue';

import { UiIcon, IconIds } from '@/shared/ui/icon';
import type { ITableRow, ITableRowValue, ITableRowValueType } from '../../model';
import { useMarketStore } from '@/modules/widgets/market/stores';
import type { IMarketDomain } from '@/modules/widgets/market/api';
import { compareStrings } from '@/shared/lib';

import tableColumnsComponent from '../markets-table/table-columns-component.vue';
import tableRowsComponent from '../markets-table/table-rows-component.vue';
import WatchlistFilterPanel from '../filters/watchlist-filters-panel.vue';


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

const sections = ref([
	{
		name: 'Crypto', isOpen: true, data: tableRows.value,
	},
	{
		name: 'Stock', isOpen: false, data: tableRows.value,
	},
	{
		name: 'Forex', isOpen: false, data: tableRows.value,
	},
	{
		name: 'Commodity', isOpen: false, data: [],
	},
]);

const toggleSection = (sectionName: string) => {
	sections.value.forEach(section => {
		if (section.name === sectionName) {
			section.isOpen = !section.isOpen;
		}
	});
};
</script>

<template>
	<div class="root">
		<watchlist-filter-panel />
		<!-- <table-rows-component :rows="tableRows" /> -->
		<div class="watchlist-content">
			<!-- Заголовки таблицы -->
			<table-columns-component />

			<!-- Секции рынков -->
			<div class="market-sections">
				<div
					v-for="section in sections"
					:key="section.name"
					class="market-section"
				>
					<!-- Заголовок секции -->
					<div class="section-header" @click="toggleSection(section.name)">
						<span class="section-toggle">
							<ui-icon v-if="section.isOpen" :id="IconIds.DropdownDown" />
						</span>
						<span class="section-name">{{ section.name }}</span>
					</div>

					<!-- Данные секции -->
					<div v-if="section.isOpen" class="section-data">
						<table-rows-component :rows="section.data" />
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.watchlist-content {
	flex: 1;
	overflow-y: auto;
}

.table-header {
	display: flex;
	padding: 0px 40px 0px 16px;
	align-items: center;
	gap: 8px;
	align-self: stretch;

	overflow: hidden;
	color: var(--color-text-base-100, #646568);
	text-align: right;
	text-overflow: ellipsis;

	/* paragraph/p-01 */
	font-size: var(--typography-paragraph-size-p-01, 12px);
	font-style: normal;
	font-weight: 440;
	line-height: 170%; /* 20.4px */
	letter-spacing: 0.096px;
}

.header-cell {
	display: flex;
	align-items: center;
}

.symbol-cell {
	flex: 1;
	min-width: 80px;
}

.price-cell {
	flex: 1;
	justify-content: flex-end;
	min-width: 80px;
}

.change-cell {
	flex: 1;
	justify-content: flex-end;
	min-width: 80px;

	&.commonly {
	color: var(--text-color-base-300);
	}

	&.positive {
		color: var(--metrics-color-positive);
	}

	&.negative {
		color: var(--metrics-color-negative-500);
	}
}

.volume-cell {
	flex: 1;
	justify-content: flex-end;
	min-width: 100px;
}

.chart-cell {
	flex: 1;
	justify-content: flex-end;
	min-width: 100px;
}

.market-section {
	margin-bottom: 8px;
}

.section-header {
	display: flex;
	align-items: center;
	padding: 8px 16px;
	font-size: 14px;
	color: #8a8a8a;
	cursor: pointer;
}

.section-toggle {
	margin-right: 8px;
	font-size: 10px;
}

.section-name {
	font-weight: 500;
}

.data-row {
	display: flex;
	align-items: center;
	padding: 8px 16px;
	font-size: 14px;
}

.cell {
	display: flex;
	align-items: center;
}

.crypto-icon {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 24px;
	height: 24px;
	margin-right: 8px;
	font-weight: bold;
	font-size: 10px;
	background-color: #2a2a2a;
	border-radius: 50%;
}

.symbol-text {
	margin-right: 4px;
}

.mini-chart {
	width: 80px;
	height: 30px;
	border-radius: 2px;
	opacity: 0.8;
}
</style>
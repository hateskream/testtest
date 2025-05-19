<script setup lang="ts">
import { ref, toValue, watch } from 'vue';

import { UiIcon, IconIds } from '@/shared/ui/icon';
import { useWatchlistStore } from '../../stores';
import type { ITableRow, ITableRowValue, ITableRowValueType, IWatchlistMarkets, IWatchlistSection } from '../../model';
import { compareStrings } from '@/shared/lib/compare-strings';
import type { IMarketDomain } from '@/modules/widgets/market/api';

import tableColumnsComponent from '../markets-table/table-columns-component.vue';
import tableRowsComponent from '../markets-table/table-rows-component.vue';
import WatchlistFilterPanel from '../filters/watchlist-filters-panel.vue';


interface IViewComponentProps {
	watchlist: IWatchlistSection[];
}

const props = defineProps<IViewComponentProps>();

const watchlistStore = useWatchlistStore();

const sectionStates = ref<Record<string, boolean>>({});

const initSectionStates = () => {
	props.watchlist.forEach(section => {
		sectionStates.value[section.id] = section.isOpen;
	});
};

initSectionStates();

// change state if got new props
watch(() => props.watchlist, () => {
	initSectionStates();
}, { deep: true });

const toggleSection = (sectionId: string) => {
	sectionStates.value[sectionId] = !sectionStates.value[sectionId];
};

const tableRows = (markets: IWatchlistMarkets[]) => {
	const rows: ITableRow[][] = [];

	markets.forEach(row => {
		if (watchlistStore.isFavorites) {
			if (watchlistStore.favorites.includes(row.id)) {
				rows.push(prepareRow(row));
			}
		} else {
			rows.push(prepareRow(row));
		}
	});

	if (watchlistStore.activeSort.direction !== 0) {
		const activeSortColumn = watchlistStore.activeTableColumns.find(column =>
			compareStrings(toValue(watchlistStore.activeSort.columnName), column.columnName),
		)!;

		rows.sort((a, b) => {
			let leftValue = a[activeSortColumn.position].value;
			let rightValue = b[activeSortColumn.position].value;

			if (watchlistStore.activeSort.direction === -1) {
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
};


function prepareRow(row: IWatchlistMarkets) {
	const data: ITableRow[] = [];

	watchlistStore.activeTableColumns.forEach(column => {
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
	<div class="root">
		<watchlist-filter-panel />
		<!-- <table-rows-component :rows="tableRows" /> -->
		<div class="watchlist-content">
			<!-- Заголовки таблицы -->
			<table-columns-component />

			<!-- Секции рынков -->
			<div class="market-sections">
				<div
					v-for="section in props.watchlist"
					:key="section.id"
					class="market-section"
				>
					<!-- Заголовок секции -->
					<div class="section-header" @click="toggleSection(section.id)">
						<span class="section-toggle">
							<ui-icon
								:id="IconIds.DropdownDown"
								class="section-icon"
								:class="{
									'section-icon__open': sectionStates[section.id],
									'section-icon__close': !sectionStates[section.id],
								}"
							/>
						</span>
						<span class="section-name">{{ section.name }}</span>
					</div>

					<!-- Данные секции -->
					<div v-if="sectionStates[section.id]" class="section-data">
						<table-rows-component :rows="tableRows(section.watchlist)" />
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
	align-items: center;
	align-self: stretch;
	padding: 0 40px 0 16px;
	overflow: hidden;
	font-style: normal;
	font-weight: 440;

	/* paragraph/p-01 */
	font-size: var(--typography-paragraph-size-p-01, 12px);
	line-height: 170%; /* 20.4px */
	text-align: right;
	color: var(--color-text-base-100, #646568);
	letter-spacing: 0.096px;
	text-overflow: ellipsis;
	gap: 8px;
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

	.section-icon {
		width: 12px;
		height: 12px;
	}

	.section-icon__close {
		transform: rotate(-90deg);
		transition: transform 0.3s ease;
	}

	.section-icon__open {
		transform: rotate(0deg);
		transition: transform 0.3s ease;
	}
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

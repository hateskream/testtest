<script setup lang="ts">
import { ref, toValue, watch } from 'vue';

import { UiIcon, IconIds } from '@/shared/ui/icon';
import { useWatchlistStore } from '../../stores';
import type { ITableRow, ITableRowValue, ITableRowValueType, IWatchlistMarkets, IWatchlistSection } from '../../model';
import { compareStrings } from '@/shared/lib/compare-strings';

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
		<div class="watchlist-content">
			<!-- Заголовки таблицы -->
			<table-columns-component />

			<!-- Секции рынков -->
			<div>
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
					<transition name="section-toggle">
						<div v-show="sectionStates[section.id]" class="section-data">
							<table-rows-component :rows="tableRows(section.watchlist)" />
						</div>
					</transition>
				</div>

				<div class="add-section-action">
					<ui-icon
						:id="IconIds.ControlPlus"
						class="section-icon"
					/>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.root {
	display: flex;
	flex-direction: column;
	height: 100%;
	padding: 0 16px 18px;
	overflow: hidden;
}

.watchlist-content {
	position: relative;
	flex: 1;
	overflow-x: auto;
	overflow-y: auto;
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

.market-section {
	position: relative;
}

.section-header {
	position: sticky;
	left: 0;
	display: inline-flex;
	align-items: center;
	padding: 12px 8px;
	font-weight: 440;
	font-size: var(--typography-paragraph-size-p-01);
	color: var(--text-color-base-100);
	letter-spacing: 0.096px;
	text-overflow: ellipsis;
	cursor: pointer;
}

.section-toggle {
	margin-right: 6px;

	.section-icon {
		display: flex;
		width: 12px;
		height: 12px;
		color: var(--text-color-base-100);
		fill: var(--text-color-base-100);
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

.section-toggle-enter-active,
.section-toggle-leave-active {
	max-height: 700px;
	opacity: 1;
	transition: all 0.3s ease;
}

.section-toggle-enter-from,
.section-toggle-leave-to {
	max-height: 0;
	transform: translateY(-10px);
	opacity: 0;
}
</style>

<script setup lang="ts">
import draggable from 'vuedraggable';
import { ref, watch, computed, toRaw } from 'vue';

import type {
	IWatchlistRow,
	IWatchlistTickerState,
	ITableColumn,
} from '../../../model';
import {
	getCellType,
	CellType,
	getSymbolCellData,
	getNumberCellData,
	getPercentCellData,
	getChartCellData,
	getRangeCellData,
	getTextCellData,
} from '../../../const';
import { useResizeBackground } from '@/modules/widgets/base/common/composables/use-resize-background';
import { useWatchlistSectionStore } from '../../../stores/watchlist-section.store.ts';

import WatchlistCellSymbol from './cells/watchlist-cell-symbol.vue';
import WatchlistCellNumber from './cells/watchlist-cell-number.vue';
import WatchlistCellPercent from './cells/watchlist-cell-percent.vue';
import WatchlistCellChart from './cells/watchlist-cell-chart.vue';
import WatchlistCellRange from './cells/watchlist-cell-range.vue';
import WatchlistCellText from './cells/watchlist-cell-text.vue';

interface IProps {
	rows: IWatchlistRow[];
	columns: ITableColumn[];
	sectionId: string;
	tickerState: IWatchlistTickerState;
}

const props = defineProps<IProps>();
const emit = defineEmits(['row-dnd']);

const watchlistSectionStore = useWatchlistSectionStore();
const { backgroundStyle } = useResizeBackground();

const mutableRows = ref<IWatchlistRow[]>([]);

// Update mutable rows when props change
watch(() => props.rows, (newRows) => {
	mutableRows.value = JSON.parse(JSON.stringify(toRaw(newRows)));
}, { immediate: true, deep: true });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onDragChange = (evt: any, sectionId: string) => {
	// evt содержит moved, added, removed
	// sectionId — id секции-приёмника
	// evt.moved/evt.added/evt.removed содержат индексы и элементы

	// Если evt.moved — это перемещение внутри одной секции
	// Если evt.added/evt.removed — это перенос между секциями

	if (evt.moved) {
		watchlistSectionStore.moveRowInSection(
			sectionId,
			evt.moved.oldIndex,
			evt.moved.newIndex,
		);
	} else if (evt.added) {
		emit('row-dnd', { type: 'added', ...evt.added, sectionId: props.sectionId });
	} else if (evt.removed) {
		emit('row-dnd', { type: 'removed', ...evt.removed, sectionId: props.sectionId });
	}
};

// Get visible columns sorted by position
const visibleColumns = computed(() => {
	return props.columns
		.filter(column => column.isShow)
		.sort((a, b) => a.position - b.position);
});
</script>

<template>
	<draggable
		v-model="mutableRows"
		:group="'watchlist-rows'"
		item-key="tickerID"
		tag="tbody"
		:class="classes.tbody"
		@change="onDragChange($event, props.sectionId)"
	>
		<template #item="{ element: row }">
			<tr :key="row.tickerID">
				<td
					v-for="(column, index) in visibleColumns"
					:key="column.id"
					:style="{
						...(index === 0 ? backgroundStyle : {})
					}"
					:class="{ [classes.firstColumn]: index === 0 }"
				>

					<div :class="classes.rowColumnWrapper">
						<!-- Symbol cell -->
						<watchlist-cell-symbol
							v-if="getCellType(column.columnType) === CellType.SYMBOL"
							:cell="getSymbolCellData(row, column)"
							:ticker-state="props.tickerState"
						/>

						<!-- Number cell -->
						<watchlist-cell-number
							v-else-if="getCellType(column.columnType) === CellType.NUMBER"
							:cell="getNumberCellData(row, column)"
							format="pretty-with-key"
						/>

						<!-- Percent cell -->
						<watchlist-cell-percent
							v-else-if="getCellType(column.columnType) === CellType.PERCENT"
							:cell="getPercentCellData(row, column)"
						/>

						<!-- Chart cell -->
						<watchlist-cell-chart
							v-else-if="getCellType(column.columnType) === CellType.CHART"
							:cell="getChartCellData(row, column)"
						/>

						<!-- Range cell -->
						<watchlist-cell-range
							v-else-if="getCellType(column.columnType) === CellType.RANGE"
							:cell="getRangeCellData(row, column)"
						/>

						<!-- Text cell -->
						<watchlist-cell-text
							v-else-if="getCellType(column.columnType) === CellType.TEXT"
							:cell="getTextCellData(row, column)"
						/>

						<!-- Fallback for unknown types -->
						<span v-else>—</span>
					</div>
				</td>

				<td :class="classes.fixTertiaryIcon" />
			</tr>
		</template>
	</draggable>
</template>

<style module="classes">
.rowColumnWrapper {
	display: flex;
	justify-content: flex-end;
	align-items: center;
	height: 50px;
	padding: 8px 0;
	font-size: 13px;
	text-align: right;
	color: #ffffff;
}

.tbody {
	display: block;
	width: max-content;
	min-width: 100%;
}

.tbody > tr {
	display: table;
	width: max-content;
	min-width: 100%;
	table-layout: fixed;
}

tbody tr:hover {
	background-color: var(--border-color-surface-02-effect);
	border-radius: 16px;
}

tbody tr:hover td:first-child .rowColumnWrapper {
	background-color: var(--border-color-surface-02-effect);
	border-top-left-radius: 16px;
	border-bottom-left-radius: 16px;
}

.firstColumn {
	position: sticky;
	top: 0;
	left: 0;
}

.firstColumn .rowColumnWrapper {
	position: relative;
	justify-content: flex-start;
}

.firstColumn .rowColumnWrapper::after {
	content: '';
	position: absolute;
	right: 0;
	width: 100%;
	height: 100%;
}

.tbody td {
	min-width: 160px;
}

.fixTertiaryIcon {
	min-width: 50px !important;
	padding-right: 8px;
}
</style>

<script setup lang="ts">
import { computed, watch } from 'vue';

import type {
	IGenericTableColumn,
	IGenericTableSection,
} from '@/modules/table';
import type { IWatchlistRow, IWatchlistTable } from '../../../model';
import { useWatchlistSectionStore, useWatchlistStore } from '../../../stores';
import {
	adaptApiColumnsToStore,
	updateStoreColumnsWithApiData,
	adaptWatchlistColumnsToGeneric,
	adaptWatchlistSectionsToGeneric,
} from '../../../utils';

import WatchlistEmptyState from '../watchlist-empty-state.vue';
import WidgetTypedTable from '@/modules/widgets/widget-table/widget-typed-table.vue';
interface IWatchlistTableProps {
	watchlistTable: IWatchlistTable;
}

const props = defineProps<IWatchlistTableProps>();

const watchlistSectionStore = useWatchlistSectionStore();
const watchlistStore = useWatchlistStore();

// Флаг для отслеживания первоначальной инициализации колонок
let isColumnsInitialized = false;

// Синхронизируем секции из API с store
watch(() => props.watchlistTable.sections, (newSections) => {
	watchlistSectionStore.setSections(newSections);
}, { immediate: true, deep: true });

// Синхронизируем колонки из API с store
watch(() => props.watchlistTable.columns, (newColumns) => {
	if (newColumns.length > 0) {
		if (!isColumnsInitialized) {
			// При первоначальной загрузке полностью заменяем колонки данными из API
			const adaptedColumns = adaptApiColumnsToStore(newColumns);
			watchlistStore.updateActiveTableColumns(adaptedColumns);
			isColumnsInitialized = true;
		} else {
			// При последующих обновлениях сохраняем пользовательские настройки
			const currentStoreColumns = watchlistStore.activeTableColumns;
			const updatedColumns = updateStoreColumnsWithApiData(currentStoreColumns, newColumns);
			watchlistStore.updateActiveTableColumns(updatedColumns);
		}
	}
}, { immediate: true });


// export interface IGenericTableColumn {
// 	key: string;
// 	label: string;
// 	shortLabel?: string;
// 	position: number;
// 	sortable: boolean;
// 	draggable: boolean;
// 	visible: boolean;
// 	width?: number;
// 	minWidth?: number;
// 	type: 'string' | 'number' | 'date' | 'percent' | 'image-string';
// 	group?: {
// 		name: string;
// 		displayName: string;
// 	};
// }

// export interface ITableColumn extends IWatchlistColumn {
// id: string;
// columnType: string;
// isShow: boolean;
// order: number;
// sort?: string;
// width?: number;
// ___
// 	position: number;
// 	displayColumnName: string;
// 	displayShortColumnName: string;
// 	isToggleable: boolean;
// 	isDraggable: boolean;
// 	group: {
// 		order?: number;
// 		name: string;
// 	};
// 	columnName: string;
// }

// Адаптированные данные для GenericDataTable
const genericColumns = computed<IGenericTableColumn[]>(() => {
	return adaptWatchlistColumnsToGeneric(watchlistStore.activeTableColumns);
});

const genericSections = computed<IGenericTableSection<IWatchlistRow>[]>(() => {
	return adaptWatchlistSectionsToGeneric(watchlistSectionStore.sections);
});
</script>

<template>
	<div :class="classes.watchlistTable">
		<widget-typed-table
			v-if="genericSections.length > 0"
			:sections="genericSections"
			:columns="genericColumns"
			:enable-drag-drop="true"
			:enable-column-reordering="true"
			:enable-sorting="false"
			:enable-column-settings="true"
			:sticky-header="true"
			:sticky-first-column="true"
			:enable-row-actions="false"
			:show-header="true"
		/>
		<!-- <template #cell-symbol="{ value }">
			<span>{{ value }}</span>
		</template> -->

		<!-- <template #cell-change="{ value }">
			<performance-bar-cell
				v-if="performanceStore.currentDisplayMode === 'bar'"
				:value="value"
				:max-abs-value="maxAbsValue"
			/>

			<span v-else :style="{ color: getChangeColor(value) }">
				{{ formatChange(value) }}
			</span>
		</template> -->
		<watchlist-empty-state v-else />
	</div>
</template>

<style module="classes">
.watchlistTable {
	position: relative;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	overflow: hidden;
}
</style>

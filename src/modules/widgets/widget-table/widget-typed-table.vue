<script setup lang="ts" generic="T">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { computed, getCurrentInstance, ref } from 'vue';

import { getComponentByType, CellType } from './cells/cell-types';
import type {
	IGenericTableColumn,
	IGenericTableSection,
	IGenericTableRow,
	ISortConfig,
	IDragDropEvent,
} from '@/modules/table/type';
import { GenericDataTable } from '@/modules/table';
import type { IWatchlistTickerState } from '@/modules/widgets/watchlist/model';
import { ModalFilterTabWrapper } from '@/modules/widgets/base';

export interface IExtendedTableColumn extends IGenericTableColumn {
	type?: string | undefined;
}

export interface IProps<T> {
	sections?: IGenericTableSection<T>[];
	rows?: IGenericTableRow<T>[];
	columns: IExtendedTableColumn[];
	sortConfig?: ISortConfig;
	enableDragDrop?: boolean;
	enableColumnReordering?: boolean;
	enableSorting?: boolean;
	enableColumnSettings?: boolean;
	stickyHeader?: boolean;
	stickyFirstColumn?: boolean;
	enableRowActions?: boolean;
	showHeader?: boolean;
	tickerState?: IWatchlistTickerState;
}

export interface IEmits<T> {
	(e: 'update:columns', columns: IExtendedTableColumn[]): void; // Updated to match

	(e: 'update:sections', sections: IGenericTableSection<T>[]): void;

	(e: 'update:unsorted-rows', rows: IGenericTableRow<T>[]): void;

	(e: 'update:sortConfig', config: ISortConfig): void;

	(e: 'rowMoved', payload: IDragDropEvent<T>): void;

	(e: 'rowDeleted', payload: { rowId: string; sectionId: string }): void;

	(e: 'sectionToggled', sectionId: string): void;

	(e: 'sectionAdded', sectionName: string): void;

	(e: 'sectionDeleted', sectionId: string): void;

	(e: 'sectionRenamed', payload: { sectionId: string; newName: string }): void;

	(e: 'columnSorted', payload: { columnKey: string; direction: 'asc' | 'desc' | 'none' }): void;
}

const props = withDefaults(defineProps<IProps<T>>(), {
	sections: () => [],
	rows: () => [],
	tickerState: () => ({
		isShowLogo: true,
		isShowTicker: true,
		isShowDescription: true,
	}),
	enableDragDrop: true,
	enableColumnReordering: true,
	enableSorting: true,
	enableColumnSettings: true,
	stickyHeader: true,
	stickyFirstColumn: true,
	enableRowActions: true,
	sortConfig: () => ({ columnKey: '', direction: 'none' }),
	showHeader: true,
});

const emit = defineEmits<IEmits<T>>();

// Computed property to check which columns have custom slots from parent
const hasCustomSlots = computed(() => {
	const slots = getCurrentInstance()?.slots || {};
	return props.columns.reduce((acc, column) => {
		acc[column.key] = !!(slots[`cell-${column.key}`] || slots[`header-${column.key}`]);
		return acc;
	}, {} as Record<string, boolean>);
});

// Function to get the appropriate component for a column type
const getCellComponent = (columnType: string | undefined | null) => {
	// Try to match the column type to a CellType enum
	if (!columnType) {
		return getComponentByType(null);
	}
	const cellType = Object.values(CellType).find(type => type === columnType) as CellType;
	return getComponentByType(cellType);
};

// Forward all events from generic-data-table
const handleColumnsUpdate = (columns: IExtendedTableColumn[]) => emit('update:columns', columns); // Updated type
const handleSectionsUpdate = (sections: IGenericTableSection<T>[]) => emit('update:sections', sections);
const handleUnsortedRowsUpdate = (rows: IGenericTableRow<T>[]) => emit('update:unsorted-rows', rows);
const handleSortUpdate = (config: ISortConfig) => emit('update:sortConfig', config);
const handleRowMoved = (payload: IDragDropEvent<T>) => emit('rowMoved', payload);
const handleRowDeleted = (payload: { rowId: string; sectionId: string }) => emit('rowDeleted', payload);
const handleSectionToggled = (sectionId: string) => emit('sectionToggled', sectionId);
const handleSectionAdded = (sectionName: string) => emit('sectionAdded', sectionName);
const handleSectionDeleted = (sectionId: string) => emit('sectionDeleted', sectionId);
const handleSectionRenamed = (payload: { sectionId: string; newName: string }) => emit('sectionRenamed', payload);
const handleColumnSorted =
	(payload: { columnKey: string; direction: 'asc' | 'desc' | 'none' }) => emit('columnSorted', payload);

const showDescription = ref<boolean>(true);
const showImage = ref<boolean>(true);

const handleToggleDescription = () => {
	if (showDescription.value) {
		showImage.value = true;
	}
	showDescription.value = !showDescription.value;
};

const handleToggleImage = () => {
	if (showImage.value) {
		showDescription.value = true;
	}
	showImage.value = !showImage.value;
};

const tickerState = computed(() => {
	return {
		...props.tickerState,
		isShowLogo: showImage.value,
		isShowTicker: showDescription.value,
		isShowDescription: showDescription.value,
	};
});


</script>

<template>
	<generic-data-table
		v-bind="props"
		@update:columns="handleColumnsUpdate"
		@update:sections="handleSectionsUpdate"
		@update:unsorted-rows="handleUnsortedRowsUpdate"
		@update:sort-config="handleSortUpdate"
		@row-moved="handleRowMoved"
		@row-deleted="handleRowDeleted"
		@section-toggled="handleSectionToggled"
		@section-added="handleSectionAdded"
		@section-deleted="handleSectionDeleted"
		@section-renamed="handleSectionRenamed"
		@column-sorted="handleColumnSorted"
	>
		<!-- Forward header slots from parent or use default -->
		<template
			v-for="column in columns"
			:key="`header-${column.key}`"
			#[`header-${column.key}`]="headerProps"
		>
			<slot
				:name="`header-${column.key}`"
				v-bind="headerProps"
			>
				{{ column.label }}
			</slot>
		</template>

		<!-- Handle cell slots with type-based component rendering -->
		<template
			v-for="column in columns"
			:key="`cell-${column.key}`"
			#[`cell-${column.key}`]="cellProps"
		>
			<!-- If parent provides a custom slot, use it -->
			<slot
				v-if="hasCustomSlots[column.key]"
				:name="`cell-${column.key}`"
				v-bind="cellProps"
			/>
			<!-- Otherwise, use the component based on column type -->
			<template v-else>
				<!-- {{ cellProps.row.data[column.key].value }} -->
				<!-- {{ cellProps.row.data[column.key]  }} -->
				<!-- {{column.type}} -->

				<!-- {{ cellProps.row.data }} -->
				<!-- {{ cellProps.row.data[column.key] }} -->
				<!-- {{ getCellComponent(column.type).__name }} -->
				<component
					:is="getCellComponent(column.type)"
					v-if="column.type === 'symbol' || column.type === 'image-string'"
					:data="cellProps.row.data[column.key]"
					:ticker-state="tickerState"
				/>
				<component
					:is="getCellComponent(column.type)"
					v-else
					:data="cellProps.row.data[column.key]"
				/>
			</template>
		</template>

		<!-- Forward section header slot -->
		<template #section-header="sectionProps">
			<slot name="section-header" v-bind="sectionProps">
				{{ sectionProps.section.title }}
			</slot>
		</template>

		<!-- Forward pagination slot -->
		<template #pagination>
			<slot name="pagination" />
		</template>

		<!-- Forward header settings slot -->
		<template
			#first-column-settings
			v-if="
				props.stickyFirstColumn &&
					columns.length > 0 &&
					( columns[0]?.type === 'symbol' || columns[0].type === 'image-string')"
		>
			<div

				:class="classes.row"
			>
				<div :class="classes.rowTitle">
					{{ columns[0].label }}
				</div>

				<div>
					<div :class="classes.tabs">
						<modal-filter-tab-wrapper
							:is-active="showImage"
							@click="handleToggleImage"
						>
							Icon
						</modal-filter-tab-wrapper>
						<modal-filter-tab-wrapper
							:is-active="showDescription"
							@click="handleToggleDescription"
						>
							Description
						</modal-filter-tab-wrapper>
					</div>
				</div>
			</div>
		</template>

		<!-- Forwarded row actions slot -->
		<template #row-actions>
			<slot name="row-actions">
			</slot>
		</template>
	</generic-data-table>
</template>

<style module="classes">
.row {
	display: flex;
	align-items: center;
	padding: 4px 12px;
}

.rowTitle {
	flex: 0 0 100px;
	font-size: 12px;
	text-align: left;
	color: var(--text-color-base-300);
	text-transform: capitalize;
}

.tabs {
	display: flex;
	gap: 8px;
	flex-wrap: wrap;
}
</style>

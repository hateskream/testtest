<script setup lang="ts" generic="T">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { computed, ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core';

import type {
	IGenericTableColumn,
	IGenericTableSection,
	IGenericTableRow,
	ISortConfig,
	IDragDropEvent,
} from '../type';
import { useTableLayout } from '../table-common';

import GenericGridHeader from './generic-grid-header.vue';
import SectionedTableContent from './sectioned-table-content.vue';
import UnsectionedTableContent from './unsectioned-table-content.vue';

export interface IProps<T> {
	sections?: IGenericTableSection<T>[];
	rows?: IGenericTableRow<T>[];
	columns: IGenericTableColumn[];
	sortConfig?: ISortConfig;
	enableDragDrop?: boolean;
	enableColumnReordering?: boolean;
	enableSorting?: boolean;
	enableColumnSettings?: boolean;
	stickyHeader?: boolean;
	stickyFirstColumn?: boolean;
	enableRowActions?: boolean;
	showHeader?: boolean;
	canAddSections?: boolean;
}

export interface IEmits<T> {
	(e: 'update:columns', columns: IGenericTableColumn[]): void;

	(e: 'update:sections', sections: IGenericTableSection<T>[]): void;

	(e: 'update:unsorted-rows', rows: IGenericTableRow<T>[]): void;

	(e: 'update:sortConfig', config: ISortConfig): void;

	(e: 'rowMoved', payload: IDragDropEvent<T>): void;

	(e: 'rowDeleted', payload: { rowId: string; sectionId?: string }): void;

	(e: 'sectionToggled', sectionId: string): void;

	(e: 'sectionAdded', sectionName: string): void;

	(e: 'sectionDeleted', sectionId: string): void;

	(e: 'sectionRenamed', payload: { sectionId: string; newName: string }): void;

	(e: 'columnSorted', payload: { columnKey: string; direction: 'asc' | 'desc' | 'none' }): void;

	(e: 'click-on-row', tickerId: string): void;
}

const props = withDefaults(defineProps<IProps<T>>(), {
	sections: () => [],
	rows: () => [],
	enableDragDrop: true,
	enableColumnReordering: true,
	enableSorting: true,
	enableColumnSettings: true,
	stickyHeader: true,
	stickyFirstColumn: true,
	enableRowActions: true,
	sortConfig: () => ({ columnKey: '', direction: 'none' }),
	showHeader: true,
	canAddSections: false,
});

const emit = defineEmits<IEmits<T>>();
const { getColumnStyles } = useTableLayout();

const localColumns = ref<IGenericTableColumn[]>([...props.columns]);
const localSections = ref<IGenericTableSection<T>[]>([...props.sections]);
const localUnsortedRows = ref<IGenericTableRow<T>[]>([...props.rows]);
const localSortConfig = ref<ISortConfig>({ ...props.sortConfig });

const visibleColumns = computed(() =>
	localColumns.value
		.filter(col => col.visible)
		.sort((a, b) => a.position - b.position),
);

const columnStyles = computed(() => {
	return getColumnStyles(visibleColumns.value);
});

// Determine if this is a sectioned table
const isSectionedTable = computed(() => {
	return localSections.value.length > 0;
});

watch(() => props.columns, (newColumns) => {
	localColumns.value = [...newColumns];
}, { deep: true });

watch(() => props.sections, (newSections) => {
	localSections.value = [...newSections];
}, { deep: true });

watch(() => props.rows, (newUnsortedRows) => {
	localUnsortedRows.value = [...newUnsortedRows];
}, { deep: true });

watch(() => props.sortConfig, (newSortConfig) => {
	localSortConfig.value = { ...newSortConfig };
}, { deep: true });

const handleColumnsUpdate = (columns: IGenericTableColumn[]) => {
	localColumns.value = [...columns];
	emit('update:columns', columns);
};

const handleSectionsUpdate = (sections: IGenericTableSection<T>[]) => {
	localSections.value = [...sections];
	emit('update:sections', sections);
};

const handleUnsortedRowsUpdate = (rows: IGenericTableRow<T>[]) => {
	localUnsortedRows.value = [...rows];
	emit('update:unsorted-rows', rows);
};

const handleSortUpdate = (config: ISortConfig) => {
	localSortConfig.value = { ...config };
	emit('update:sortConfig', config);
	emit('columnSorted', {
		columnKey: config.columnKey,
		direction: config.direction,
	});
};

// Handle events from sectioned table
const handleSectionedRowMoved = (payload: IDragDropEvent<T>) => {
	if (payload.sectionId === 'unsorted') {
		const updatedRows = [...localUnsortedRows.value];

		if (payload.type === 'moved') {
			const [movedRow] = updatedRows.splice(payload.oldIndex!, 1);
			updatedRows.splice(payload.newIndex!, 0, movedRow);
			handleUnsortedRowsUpdate(updatedRows as IGenericTableRow<T>[]);
		} else if (payload.type === 'added') {
			updatedRows.splice(payload.newIndex!, 0, payload.element);
			handleUnsortedRowsUpdate(updatedRows as IGenericTableRow<T>[]);
		} else if (payload.type === 'removed') {
			updatedRows.splice(payload.oldIndex!, 1);
			handleUnsortedRowsUpdate(updatedRows as IGenericTableRow<T>[]);
		}
	} else {
		const updatedSections = [...localSections.value];

		if (payload.type === 'added' && payload.element) {
			const targetSection = updatedSections.find(s => s.id === payload.sectionId);
			if (targetSection) {
				targetSection.rows.splice(payload.newIndex!, 0, payload.element);
			}
		} else if (payload.type === 'removed') {
			const sourceSection = updatedSections.find(s => s.id === payload.sectionId);
			if (sourceSection) {
				sourceSection.rows.splice(payload.oldIndex!, 1);
			}
		} else if (payload.type === 'moved') {
			const section = updatedSections.find(s => s.id === payload.sectionId);
			if (section) {
				const [movedRow] = section.rows.splice(payload.oldIndex!, 1);
				section.rows.splice(payload.newIndex!, 0, movedRow);
			}
		}

		handleSectionsUpdate(updatedSections as IGenericTableSection<T>[]);
	}

	emit('rowMoved', payload);
};

// Handle events from unsectioned table
const handleUnsectionedRowMoved = (payload: IDragDropEvent<T>) => {
	const updatedRows = [...localUnsortedRows.value];

	if (payload.type === 'moved') {
		const [movedRow] = updatedRows.splice(payload.oldIndex!, 1);
		updatedRows.splice(payload.newIndex!, 0, movedRow);
		handleUnsortedRowsUpdate(updatedRows as IGenericTableRow<T>[]);
	} else if (payload.type === 'added') {
		updatedRows.splice(payload.newIndex!, 0, payload.element);
		handleUnsortedRowsUpdate(updatedRows as IGenericTableRow<T>[]);
	} else if (payload.type === 'removed') {
		updatedRows.splice(payload.oldIndex!, 1);
		handleUnsortedRowsUpdate(updatedRows as IGenericTableRow<T>[]);
	}

	emit('rowMoved', payload);
};

const handleRowDeleted = (payload: { rowId: string; sectionId?: string }) => {
	if (isSectionedTable.value && payload.sectionId) {
		if (payload.sectionId === 'unsorted') {
			const updatedRows = localUnsortedRows.value.filter(row => row.id !== payload.rowId);
			handleUnsortedRowsUpdate(updatedRows as IGenericTableRow<T>[]);
		} else {
			const updatedSections = localSections.value.map(section => {
				if (section.id === payload.sectionId) {
					return {
						...section,
						rows: section.rows.filter(row => row.id !== payload.rowId),
					};
				}
				return section;
			});
			handleSectionsUpdate(updatedSections as IGenericTableSection<T>[]);
		}
	} else {
		// Unsectioned table
		const updatedRows = localUnsortedRows.value.filter(row => row.id !== payload.rowId);
		handleUnsortedRowsUpdate(updatedRows as IGenericTableRow<T>[]);
	}

	emit('rowDeleted', payload);
};

const handleSectionToggled = (sectionId: string) => {
	const updatedSections = localSections.value.map(section =>
		section.id === sectionId
			? { ...section, isCollapsed: !section.isCollapsed }
			: section,
	);
	handleSectionsUpdate(updatedSections as IGenericTableSection<T>[]);
	emit('sectionToggled', sectionId);
};

const handleSectionAdded = (sectionName: string) => {
	emit('sectionAdded', sectionName);
};

const handleSectionDeleted = (sectionId: string) => {
	const updatedSections = localSections.value.filter(section => section.id !== sectionId);
	handleSectionsUpdate(updatedSections as IGenericTableSection<T>[]);
	emit('sectionDeleted', sectionId);
};

const handleSectionRenamed = (payload: { sectionId: string; newName: string }) => {
	const updatedSections = localSections.value.map(section =>
		section.id === payload.sectionId
			? { ...section, title: payload.newName }
			: section,
	);
	handleSectionsUpdate(updatedSections as IGenericTableSection<T>[]);
	emit('sectionRenamed', payload);
};

/// need for child for hover rows

const containerRef: Ref<HTMLDivElement | null> = ref(null);


const {
	width: containerWidth,

}: {
	width: Ref<number>;

} = useElementSize(containerRef);


</script>

<template generic="T">
	<div :class="classes.tableContainer">
		<div ref="containerRef" :class="classes.scrollContainer">
			<table
				:class="classes.dataTable"
				:style="columnStyles"
				style=" width: 100%;min-width: max-content;"
			>
				<generic-grid-header
					v-if="props.showHeader"
					:columns="visibleColumns"
					:all-columns="localColumns"
					:sort-config="localSortConfig"
					:enable-reordering="enableColumnReordering"
					:enable-sorting="enableSorting"
					:enable-column-settings="enableColumnSettings"
					:enable-row-actions="enableRowActions"
					:sticky="stickyHeader"
					:sticky-first-column="stickyFirstColumn"
					@update:columns="handleColumnsUpdate"
					@update:sort="handleSortUpdate"
				>
					<template
						v-for="(column, index) in visibleColumns"
						:key="column.key"
						#[`header-${index}`]="headerProps"
					>
						<slot
							:name="`header-${column.key}`"
							v-bind="headerProps"
						>
							<slot
								:name="`header-${index}`"
								v-bind="headerProps"
							>
								{{ column.label }}
							</slot>
						</slot>
					</template>

					<template
						v-if="stickyFirstColumn && $slots['first-column-settings']"
						#first-column-settings
					>

						<slot name="first-column-settings">

						</slot>
					</template>
				</generic-grid-header>

				<!-- Sectioned Table Content -->
				<sectioned-table-content
					v-if="isSectionedTable"
					:sections="localSections"
					:columns="visibleColumns"
					:sort-config="localSortConfig"
					:can-add-sections="canAddSections"
					:enable-drag-drop="enableDragDrop"
					:sticky-first-column="stickyFirstColumn"
					:enable-row-actions="enableRowActions"
					:enable-column-settings="enableColumnSettings"
					@update:sections="handleSectionsUpdate"
					@row-moved="handleSectionedRowMoved"
					@row-deleted="handleRowDeleted"
					@section-toggled="handleSectionToggled"
					@section-added="handleSectionAdded"
					@section-deleted="handleSectionDeleted"
					@section-renamed="handleSectionRenamed"
					@click-on-row="emit('click-on-row', $event)"
				>
					<template
						v-for="(column, index) in visibleColumns"
						:key="column.key"
						#[`cell-${index}`]="cellProps"
					>
						<slot
							:name="`cell-${column.key}`"
							v-bind="cellProps"
						>
							<slot
								:name="`cell-${index}`"
								v-bind="cellProps"
							>
								{{ cellProps.row.data[column.key] }}
							</slot>
						</slot>
					</template>

					<template #section-header="sectionProps">
						<slot name="section-header" v-bind="sectionProps">
							{{ sectionProps.section.title }}
						</slot>
					</template>

					<template #section-actions="sectionId : string">
						<slot name="section-actions" v-bind="sectionId">
						</slot>
					</template>

					<template #row-actions="{ tickerId }">
						<slot name="row-actions" :ticker-id="tickerId">
						</slot>
					</template>
				</sectioned-table-content>

				<!-- Unsectioned Table Content -->
				<unsectioned-table-content
					v-else
					:rows="localUnsortedRows"
					:columns="visibleColumns"
					:sort-config="localSortConfig"
					:enable-drag-drop="enableDragDrop"
					:sticky-first-column="stickyFirstColumn"
					:enable-row-actions="enableRowActions"
					:enable-column-settings="enableColumnSettings"
					:container-width="containerWidth"
					@update:rows="handleUnsortedRowsUpdate"
					@row-moved="handleUnsectionedRowMoved"
					@row-deleted="handleRowDeleted"
					@click-on-row="emit('click-on-row', $event)"
				>
					<template
						v-for="(column, index) in visibleColumns"
						:key="column.key"
						#[`cell-${index}`]="cellProps"
					>
						<slot
							:name="`cell-${column.key}`"
							v-bind="cellProps"
						>
							<slot
								:name="`cell-${index}`"
								v-bind="cellProps"
							>
								{{ cellProps.row.data[column.key] }}
							</slot>
						</slot>
					</template>
					<template #row-actions="{ tickerId }">
						<slot name="row-actions" :ticker-id="tickerId">
						</slot>
					</template>
				</unsectioned-table-content>
			</table>
		</div>

		<!-- Pagination outside scroll area -->
		<div v-if="$slots.pagination" :class="classes.paginationWrapper">
			<slot name="pagination" />
		</div>
	</div>
</template>

<style module="classes">
.tableContainer {
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	width: 100%;
	height: 100%;
	overflow: hidden;
}

.scrollContainer {
	flex: 1;
	min-height: 0;
	overflow: auto;
	scrollbar-width: thin;
	scrollbar-color: rgb(255 255 255 / 30%) rgb(255 255 255 / 10%);
}

.scrollContainer::-webkit-scrollbar {
	width: 12px;
	height: 12px;
}

.scrollContainer::-webkit-scrollbar-track {
	background: rgb(255 255 255 / 5%);
	border-radius: 6px;
}

.scrollContainer::-webkit-scrollbar-thumb {
	background: rgb(255 255 255 / 20%);
	border: 2px solid rgb(255 255 255 / 5%);
	border-radius: 6px;
}

.scrollContainer::-webkit-scrollbar-thumb:hover {
	background: rgb(255 255 255 / 30%);
}

.scrollContainer::-webkit-scrollbar-corner {
	background: rgb(255 255 255 / 5%);
}

.dataTable {
	width: 100%;
	min-width: fit-content;
	border-collapse: collapse;
	table-layout: fixed;
	background: var(--bg-color-surface-01, #1a1a1a);
}

.paginationWrapper {
	flex-shrink: 0;
	padding: 16px 0;
	background: var(--bg-color-surface-01, #1a1a1a);
}
</style>

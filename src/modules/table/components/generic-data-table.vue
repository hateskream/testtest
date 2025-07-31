<script setup lang="ts" generic="T">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { computed, ref, watch } from 'vue';

import type {
	IGenericTableColumn,
	IGenericTableSection,
	IGenericTableRow,
	ISortConfig,
	IDragDropEvent,
} from '../type';

import GenericGridHeader from './generic-grid-header.vue';
import GenericGridBody from './generic-grid-body.vue';

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
}

export interface IEmits<T> {
	(e: 'update:columns', columns: IGenericTableColumn[]): void;

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

const localColumns = ref<IGenericTableColumn[]>([...props.columns]);
const localSections = ref<IGenericTableSection<T>[]>([...props.sections]);
const localUnsortedRows = ref<IGenericTableRow<T>[]>([...props.rows]);
const localSortConfig = ref<ISortConfig>({ ...props.sortConfig });

const visibleColumns = computed(() =>
	localColumns.value
		.filter(col => col.visible)
		.sort((a, b) => a.position - b.position),
);


// Helper function to get base column widths
// Helper function to get base column widths

// Helper function to get base column widths
const getBaseColumnWidths = (position: 'header' | 'body') => {
	let addToLastColumn = 0;
	if (position === 'body') {
		if (props.enableColumnSettings && !props.enableRowActions) {
			addToLastColumn = 50;
		}
	}
	if (position === 'header') {
		if (!props.enableColumnSettings && props.enableRowActions) {
			addToLastColumn = 50;
		}
	}
	const result = visibleColumns.value.map((col, index) => {
		const hasWidth = col.width !== undefined && col.width !== null;
		const hasMinWidth = col.minWidth !== undefined && col.minWidth !== null;
		const additionalWidth = index === visibleColumns.value.length - 1 ? addToLastColumn : 0;


		if (index === 0) {
			const minColumnWidth = col.minWidth || 300; // Changed from 100 to 300
			if (additionalWidth > 0) {
				return `minmax(${minColumnWidth + additionalWidth}px, calc(1fr + ${additionalWidth}px))`;
			} else {
				return `minmax(${minColumnWidth}px, 1fr)`;
			}
		}

		if (hasMinWidth && !hasWidth) {
			return `minmax(${col.minWidth! + additionalWidth}px, 1fr)`;
		} else if (hasWidth && !hasMinWidth) {
			return `${col.width! + additionalWidth}px`;
		} else if (hasWidth && hasMinWidth) {
			return `minmax(${col.minWidth! + additionalWidth}px, ${col.width! + additionalWidth}px)`;
		} else {
			// Changed from '1fr' to use 150px default minWidth for non-first columns
			return `minmax(${150 + additionalWidth}px, 1fr)`;
		}
	});
	if (props.enableRowActions && position === 'body') {
		result.push('50px');
	}
	if (props.enableRowActions && position === 'header') {
		// result.push('50px')
	}
	return result;
};

// Helper function to expand last column width

// Grid template for header
const gridTemplateColumns = computed(() => {
	const columnWidths = getBaseColumnWidths('header');

	return columnWidths.join(' ');
});

// Grid template for body (rows and sections)
const bodyGridTemplateColumns = computed(() => {
	let columnWidths = getBaseColumnWidths('body');
	return columnWidths.join(' ');
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

const handleRowMoved = (payload: IDragDropEvent<T>) => {
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

const handleRowDeleted = (payload: { rowId: string; sectionId: string }) => {
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
</script>

<template generic="T">
	<div :class="classes.gridTable">

		<div :class="classes.scrollContainer">
			<generic-grid-header
				v-if="props.showHeader"
				:columns="visibleColumns"
				:all-columns="localColumns"
				:sort-config="localSortConfig"
				:grid-template-columns="gridTemplateColumns"
				:enable-reordering="enableColumnReordering"
				:enable-sorting="enableSorting"
				:enable-settings="enableColumnSettings"
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

				<template v-if="!enableColumnSettings" #header-settings>
					<slot name="header-settings">
					</slot>
				</template>
			</generic-grid-header>

			<generic-grid-body
				:sections="localSections"
				:unsorted-rows="localUnsortedRows"
				:columns="visibleColumns"
				:sort-config="localSortConfig"
				:grid-template-columns="bodyGridTemplateColumns"
				:enable-drag-drop="enableDragDrop"
				:sticky-first-column="stickyFirstColumn"
				:enable-row-actions="enableRowActions"
				@update:sections="handleSectionsUpdate"
				@update:unsorted-rows="handleUnsortedRowsUpdate"
				@row-moved="handleRowMoved"
				@row-deleted="handleRowDeleted"
				@section-toggled="handleSectionToggled"
				@section-added="handleSectionAdded"
				@section-deleted="handleSectionDeleted"
				@section-renamed="handleSectionRenamed"
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
			</generic-grid-body>
		</div>

		<!-- Pagination outside scroll area -->
		<div :class="classes.paginationWrapper">
			<slot name="pagination" />
		</div>
	</div>
</template>

<style module="classes">
.gridTable {
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

.paginationWrapper {
	flex-shrink: 0;
	padding: 16px 0;
	background: var(--bg-color-surface-01, #1a1a1a);
	border-top: 1px solid var(--border-color-base-300, #444444);
}
</style>

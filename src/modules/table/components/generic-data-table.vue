<script setup lang="ts" generic="T extends Record<string, unknown>">
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

export interface IProps {
	sections?: IGenericTableSection[];
	rows?: IGenericTableRow[];
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

export interface IEmits {
	(e: 'update:columns', columns: IGenericTableColumn[]): void;
	(e: 'update:sections', sections: IGenericTableSection[]): void;
	(e: 'update:unsorted-rows', rows: IGenericTableRow[]): void;
	(e: 'update:sortConfig', config: ISortConfig): void;
	(e: 'rowMoved', payload: IDragDropEvent): void;
	(e: 'rowDeleted', payload: { rowId: string; sectionId: string }): void;
	(e: 'sectionToggled', sectionId: string): void;
	(e: 'sectionAdded', sectionName: string): void;
	(e: 'sectionDeleted', sectionId: string): void;
	(e: 'sectionRenamed', payload: { sectionId: string; newName: string }): void;
	(e: 'columnSorted', payload: { columnKey: string; direction: 'asc' | 'desc' | 'none' }): void;
}

const props = withDefaults(defineProps<IProps>(), {
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

const emit = defineEmits<IEmits>();

const localColumns = ref<IGenericTableColumn[]>([...props.columns]);
const localSections = ref<IGenericTableSection[]>([...props.sections]);
const localUnsortedRows = ref<IGenericTableRow[]>([...props.rows]);
const localSortConfig = ref<ISortConfig>({ ...props.sortConfig });

const visibleColumns = computed(() =>
	localColumns.value
		.filter(col => col.visible)
		.sort((a, b) => a.position - b.position),
);

const gridTemplateColumns = computed(() => {
	const columnWidths = visibleColumns.value.map(col => {
		const hasWidth = col.width !== undefined && col.width !== null;
		const hasMinWidth = col.minWidth !== undefined && col.minWidth !== null;

		if (hasMinWidth && !hasWidth) {
			return `minmax(${col.minWidth}px, 1fr)`;
		} else if (hasWidth && !hasMinWidth) {
			return `${col.width}px`;
		} else if (hasWidth && hasMinWidth) {
			return `minmax(${col.minWidth}px, ${col.width}px)`;
		} else {
			return 'minmax(100px, 1fr)';
		}
	});

	if (props.enableColumnSettings) {
		columnWidths.push('50px');
	}
	if (props.enableRowActions) {
		columnWidths.push('50px');
	}
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

const handleSectionsUpdate = (sections: IGenericTableSection[]) => {
	localSections.value = [...sections];
	emit('update:sections', sections);
};

const handleUnsortedRowsUpdate = (rows: IGenericTableRow[]) => {
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

const handleRowMoved = (payload: IDragDropEvent) => {
	if (payload.sectionId === 'unsorted') {
		const updatedRows = [...localUnsortedRows.value];

		if (payload.type === 'moved') {
			const [movedRow] = updatedRows.splice(payload.oldIndex!, 1);
			updatedRows.splice(payload.newIndex!, 0, movedRow);
			handleUnsortedRowsUpdate(updatedRows);
		} else if (payload.type === 'added') {
			updatedRows.splice(payload.newIndex!, 0, payload.element!);
			handleUnsortedRowsUpdate(updatedRows);
		} else if (payload.type === 'removed') {
			updatedRows.splice(payload.oldIndex!, 1);
			handleUnsortedRowsUpdate(updatedRows);
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

		handleSectionsUpdate(updatedSections);
	}

	emit('rowMoved', payload);
};

const handleRowDeleted = (payload: { rowId: string; sectionId: string }) => {
	if (payload.sectionId === 'unsorted') {
		const updatedRows = localUnsortedRows.value.filter(row => row.id !== payload.rowId);
		handleUnsortedRowsUpdate(updatedRows);
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
		handleSectionsUpdate(updatedSections);
	}

	emit('rowDeleted', payload);
};

const handleSectionToggled = (sectionId: string) => {
	const updatedSections = localSections.value.map(section =>
		section.id === sectionId
			? { ...section, isCollapsed: !section.isCollapsed }
			: section,
	);
	handleSectionsUpdate(updatedSections);
	emit('sectionToggled', sectionId);
};

const handleSectionAdded = (sectionName: string) => {
	emit('sectionAdded', sectionName);
};

const handleSectionDeleted = (sectionId: string) => {
	const updatedSections = localSections.value.filter(section => section.id !== sectionId);
	handleSectionsUpdate(updatedSections);
	emit('sectionDeleted', sectionId);
};

const handleSectionRenamed = (payload: { sectionId: string; newName: string }) => {
	const updatedSections = localSections.value.map(section =>
		section.id === payload.sectionId
			? { ...section, title: payload.newName }
			: section,
	);
	handleSectionsUpdate(updatedSections);
	emit('sectionRenamed', payload);
};
</script>

<template>
	<div :class="classes.gridTable">
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
			:grid-template-columns="gridTemplateColumns"
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

			<template #pagination>
				<slot name="pagination" />
			</template>
		</generic-grid-body>
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
	overflow: auto;
}
</style>

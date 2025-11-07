<script setup lang="ts" generic="T">
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { computed, ref, watch, type Ref } from 'vue';
import { useElementSize } from '@vueuse/core';

import { useCustomScrollbar } from '../composables/use-custom-scrollbar.ts';
import type {
	IGenericTableColumn,
	IGenericTableSection,
	IGenericTableRow,
	ISortConfig,
	IDragDropEvent,
} from '../type';

import GenericGridHeader from './generic-grid-header.vue';
import UnifiedTableContent from './unified-table-content.vue';

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
	isUpdating?: boolean;
	showScrollbarsOnHover?: boolean;
	isFixedWidth?: boolean;
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
	isUpdating: false,
	showScrollbarsOnHover: true,
});

const emit = defineEmits<IEmits<T>>();

const localColumns = ref<IGenericTableColumn[]>([...props.columns]);
const localSections = ref<IGenericTableSection<T>[]>([...props.sections]);
const localUnsortedRows = ref<IGenericTableRow<T>[]>([...props.rows]);
const localSortConfig = ref<ISortConfig>({ ...props.sortConfig });

// Hover state for container
const isContainerHovered = ref(false);

const visibleColumns = computed(() =>
	localColumns.value
		.filter(col => col.visible)
		.sort((a, b) => a.position - b.position),
);

const isSectionedTable = computed(() => localSections.value.length > 0);

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
			updatedRows.splice(payload.newIndex!, 0, payload.element!);
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

const containerRef: Ref<HTMLDivElement | null> = ref(null);
const scrollContainerRef: Ref<HTMLDivElement | null> = ref(null);

const { width: containerWidth }: { width: Ref<number> } = useElementSize(containerRef);

// Custom scrollbar with hover visibility
const {
	showVerticalScrollbar,
	showHorizontalScrollbar,
	verticalThumbTop,
	horizontalThumbLeft,
	isDraggingVertical,
	isDraggingHorizontal,
	verticalTrackRef,
	horizontalTrackRef,
	handleVerticalMouseDown,
	handleHorizontalMouseDown,
	handleVerticalTrackClick,
	handleHorizontalTrackClick,
	scrollbarStyles,
	config: scrollbarConfig,
} = useCustomScrollbar(scrollContainerRef, {
	showOnHover: props.showScrollbarsOnHover,
});

// Animation control
const isAnimating = ref(false);
const shouldFinishAnimation = ref(false);

watch(() => props.isUpdating, (newValue) => {
	if (newValue) {
		isAnimating.value = true;
		shouldFinishAnimation.value = false;
	} else {
		shouldFinishAnimation.value = true;
	}
}, { immediate: true });

const handleAnimationIteration = () => {
	if (shouldFinishAnimation.value) {
		isAnimating.value = false;
		shouldFinishAnimation.value = false;
	}
};

// Handle container hover
const handleContainerMouseEnter = () => {
	isContainerHovered.value = true;
};

const handleContainerMouseLeave = () => {
	isContainerHovered.value = false;
};

const isFixedWidth = computed(()=>{
	return props.isFixedWidth || visibleColumns.value.length === 2;
});

</script>

<template>
	<div :class="classes.tableContainer">
		<!-- Inject scrollbar styles -->
		<component :is="'style'">{{ scrollbarStyles }}</component>

		<div
			ref="containerRef"
			:class="[
				classes.scrollContainer,
				'custom-scrollbar-container',
				{ 'is-hovered': isContainerHovered }
			]"
		>
			<div
				ref="scrollContainerRef"
				:class="['custom-scrollbar-content', classes.scrollContent]"
				@mouseenter="handleContainerMouseEnter"
				@mouseleave="handleContainerMouseLeave"
			>
				<table :class="classes.dataTable" :style="{width: isFixedWidth ? '100%' : 'auto'}">
					<generic-grid-header
						v-if="props.showHeader"
						:is-fixed-width="isFixedWidth"
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
							<slot name="first-column-settings" />
						</template>
					</generic-grid-header>

					<unified-table-content
						:is-fixed-width="isFixedWidth"
						:sections="isSectionedTable ? localSections : []"
						:rows="isSectionedTable ? [] : localUnsortedRows"
						:columns="visibleColumns"
						:sort-config="localSortConfig"
						:container-width="containerWidth"
						:can-add-sections="canAddSections"
						:enable-drag-drop="enableDragDrop"
						:sticky-first-column="stickyFirstColumn"
						:enable-row-actions="enableRowActions"
						:enable-column-settings="enableColumnSettings"
						@update:sections="handleSectionsUpdate"
						@update:rows="handleUnsortedRowsUpdate"
						@row-moved="handleRowMoved"
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

						<template #section-actions="{ sectionId }">
							<slot name="section-actions" :section-id="sectionId" />
						</template>

						<template #row-actions="{ tickerId, sectionId }">
							<slot
								name="row-actions"
								:ticker-id="tickerId"
								:section-id="sectionId"
							/>
						</template>
					</unified-table-content>
				</table>

				<!-- Loading indicator -->
				<div
					v-if="isAnimating"
					:class="classes.loadingIndicatorContainer"
					@animationiteration="handleAnimationIteration"
				>
					<div :class="classes.loadingIndicator"></div>
				</div>
			</div>

			<!-- Custom scrollbars with hover visibility -->
			<!-- Vertical scrollbar -->
			<div
				v-if="showVerticalScrollbar"
				ref="verticalTrackRef"
				class="custom-scrollbar-track vertical"
				:class="{
					'with-horizontal': showHorizontalScrollbar,
					'show-on-hover': props.showScrollbarsOnHover,
					'is-dragging': isDraggingVertical
				}"
				@click="handleVerticalTrackClick"
			>
				<div
					class="custom-scrollbar-thumb vertical"
					:class="{ dragging: isDraggingVertical }"
					:style="{
						top: `${scrollbarConfig.grabAreaPadding + verticalThumbTop}px`,
					}"
					@mousedown="handleVerticalMouseDown"
				/>
			</div>

			<!-- Horizontal scrollbar -->
			<div
				v-if="showHorizontalScrollbar"
				ref="horizontalTrackRef"
				class="custom-scrollbar-track horizontal"
				:class="{
					'with-vertical': showVerticalScrollbar,
					'show-on-hover': props.showScrollbarsOnHover,
					'is-dragging': isDraggingHorizontal
				}"
				@click="handleHorizontalTrackClick"
			>
				<div
					class="custom-scrollbar-thumb horizontal"
					:class="{ dragging: isDraggingHorizontal }"
					:style="{
						left: `${scrollbarConfig.grabAreaPadding + horizontalThumbLeft}px`,
					}"
					@mousedown="handleHorizontalMouseDown"
				/>
			</div>
		</div>

		<!-- Pagination slot -->
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
	position: relative;
	flex: 1;
	min-height: 0;
	padding-bottom: 2px;
	overflow: hidden;
}

.scrollContent {
	width: 100%;
	height: 100%;
	overflow: auto;
}

.loadingIndicatorContainer {
	position: sticky;
	bottom: 0;
	left: 0;
	z-index: 100;
	width: 100%;
	height: 3px;
	overflow: hidden;
	background-color: var(--bg-color-base-100);
	pointer-events: none;
}

.loadingIndicator {
	position: absolute;
	top: 0;
	width: 80px;
	height: 3px;
	background: var(--bg-color-base-500);
	animation: slide-progress 1.5s linear infinite;
}

@keyframes slide-progress {
	0% {
		left: -80px;
	}

	100% {
		left: 100%;
	}
}

.dataTable {
	width: auto;
	min-width: 100%;
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

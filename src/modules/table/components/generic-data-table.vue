<script setup lang="ts" generic="T">
// oxlint-disable-next-line typescript/ban-ts-comment
// @ts-nocheck
import { computed, nextTick, onMounted, onUnmounted, type Ref, ref, watch } from 'vue';

import { useCustomScrollbar } from '../composables/use-custom-scrollbar.ts';
import type { IDragDropEvent, IGenericTableColumn, IGenericTableRow, IGenericTableSection, ISortConfig } from '../type';
import { IconIds, UiIcon } from '@/shared/ui/icon';

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
	backgroundColor?: string | undefined;
	noVerticalScroll?:boolean;
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
	isFixedWidth: false,
	backgroundColor: undefined,
	noVerticalScroll:false,
});

const emit = defineEmits<IEmits<T>>();

const localColumns = ref<IGenericTableColumn[]>([...props.columns]);
const localSections = ref<IGenericTableSection<T>[]>([...props.sections]);
const localUnsortedRows = ref<IGenericTableRow<T>[]>([...props.rows]);
const localSortConfig = ref<ISortConfig>({ ...props.sortConfig });

const isContainerHovered = ref(false);
const tableBackgroundColor = ref<string>('');

const containerRef: Ref<HTMLDivElement | null> = ref(null);
const scrollContainerRef: Ref<HTMLDivElement | null> = ref(null);

const tableRef = ref<HTMLTableElement | null>(null);
const columnWidths = ref<string[] | undefined>(undefined);
const tableWidth = ref('auto');
const columnLayout = ref<'percent' | 'px'>(props.isFixedWidth ? 'percent' : 'px');

const isAnimating = ref(false);
const shouldFinishAnimation = ref(false);

const canScrollLeft = ref(false);
const canScrollRight = ref(false);

const visibleColumns = computed(() =>
	localColumns.value
		.filter(col => col.visible)
		.sort((a, b) => a.position - b.position),
);

const isSectionedTable = computed(() => localSections.value.length > 0);

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
	fixedThumbLength: 100,
	trackWidth: 22,
	thumbSize:22,
	grabAreaPadding:0,
});

function updateScrollState() {
	const container = scrollContainerRef.value;
	if (!container) {
		return;
	}

	canScrollLeft.value = container.scrollLeft > 1;
	canScrollRight.value = container.scrollLeft + container.clientWidth < container.scrollWidth - 1;
}

function scrollTable(direction: 'left' | 'right') {
	const container = scrollContainerRef.value;
	if (!container || !columnWidths.value) {
		return;
	}

	const currentScroll = container.scrollLeft;
	const tableElement = container.querySelector('table');
	const widths = columnWidths.value.map(w => {
		if (w.endsWith('%')) {
			return (parseFloat(w) / 100) * (tableElement?.offsetWidth || 0);
		}
		return parseFloat(w);
	});

	let targetScroll = currentScroll;

	if (direction === 'right') {
		let accumulatedWidth = 0;
		for (const width of widths) {
			accumulatedWidth += width;
			if (accumulatedWidth > currentScroll + 1) {
				targetScroll = accumulatedWidth;
				break;
			}
		}
	} else {
		let accumulatedWidth = 0;
		for (let i = 0; i < widths.length; i += 1) {
			const width = widths[i];
			if (accumulatedWidth + width >= currentScroll - 1) {
				targetScroll = accumulatedWidth - (widths[i - 1] || 0);
				break;
			}
			accumulatedWidth += width;
		}
	}

	container.scrollTo({
		left: Math.max(0, targetScroll),
		behavior: 'smooth',
	});
}

function isTransparentColor(color: string): boolean {
	if (!color || color === 'transparent') {
		return true;
	}
	const slashMatch = color.match(/rgba?\(\s*[\d.]+\s+[\d.]+\s+[\d.]+\s*\/\s*([\d.]+)(%?)\s*\)/i);
	if (slashMatch) {
		const alpha = parseFloat(slashMatch[1]);
		return (slashMatch[2] === '%' ? alpha / 100 : alpha) === 0;
	}
	const commaMatch = color.match(/rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+(?:\s*,\s*([\d.]+))?\s*\)/i);
	if (commaMatch) {
		return commaMatch[1] == null ? false : parseFloat(commaMatch[1]) === 0;
	}
	return false;
}

function getRealBackgroundColor(element: HTMLElement | null): string {
	if (!element || element === document.body || element === document.documentElement) {
		if (element) {
			const bgColor = getComputedStyle(element).backgroundColor;
			if (bgColor && !isTransparentColor(bgColor)) {
				return bgColor;
			}
		}
		return 'var(--bg-color-surface-01, #1a1a1a)';
	}
	const bgColor = getComputedStyle(element).backgroundColor;
	return (bgColor && !isTransparentColor(bgColor)) ? bgColor : getRealBackgroundColor(element.parentElement);
}

const tableBgParts = computed(() => {
	const c = (tableBackgroundColor.value || '').trim();
	const m = c.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+)\s*)?\)$/i);
	if (m) {
		return {
			rgb:
				`${Math.round(Number(m[1]))} ${Math.round(Number(m[2]))} ${Math.round(Number(m[3]))}`, a: m[4] ?? '1' };
	}
	return { rgb: '26 26 26', a: '1' };
});

const isFirstReallySticky = ref(false);
const WIDTH_MULTIPLIER=1.15;
let isMultiplierApplied = false;
async function recalculateColumnWidths() {
	await nextTick();
	const table = tableRef.value;
	if (!table) {
		return;
	}
	const headerRow = table.tHead?.rows[0] || table.rows[0];
	if (!headerRow) {
		return;
	}

	const headerCells = Array.from(headerRow.cells);
	const measuredWidths = headerCells.map(cell => cell.getBoundingClientRect().width);
	if (!isMultiplierApplied) {
		for (let i = 0; i < measuredWidths.length; i++) {
			measuredWidths[i] *= WIDTH_MULTIPLIER;
		}
		isMultiplierApplied = true;
	}
	if (!containerRef.value) {
		return;
	}
	const totalWidth = containerRef.value.getBoundingClientRect().width;
	isFirstReallySticky.value=props.stickyFirstColumn;
	if (props.isFixedWidth) {
		columnLayout.value = 'percent';
		tableWidth.value = '100%';
		const weights = visibleColumns.value.map((col, i) => {
			const mw = Number(col?.minWidth);
			return (Number.isFinite(mw) && mw > 0) ? mw : (measuredWidths[i] || 1);
		});
		const sumWeights = weights.reduce((s, w) => s + w, 0) || 1;
		const percents: number[] = [];
		let running = 0;
		for (let i = 0; i < weights.length; i += 1) {
			if (i === weights.length - 1) {
				percents.push(Math.max(0, 100 - running));
				break;
			}
			const p = (100 * weights[i]) / sumWeights;
			const rounded = Math.max(0, Math.round(p * 1000) / 1000);
			percents.push(rounded);
			running += rounded;
		}
		columnWidths.value = percents.map(p => `${p}%`);
	} else {
		const COLUMN_MIN_WIDTH = 50;
		const { minColWidth } = visibleColumns.value.reduce((acc, col) => {
			acc.minColWidth += col.minWidth || COLUMN_MIN_WIDTH;
			return acc;
		}, { minColWidth: 0 });
		columnLayout.value = (visibleColumns.value?.length < 3 || minColWidth <= totalWidth) ? 'percent' : 'px';
		if (columnLayout.value === 'px') {
			let sum = 0;
			columnWidths.value = measuredWidths.map((w, i) => {
				const col = visibleColumns.value[i];
				const width =
					col ? Math.min(Math.min(col.maxWidth||Infinity, totalWidth), Math.max(col.minWidth, w)) : w;
				sum += width;
				if (i===0&&width>totalWidth*0.3) {
					isFirstReallySticky.value = false;
				}
				return `${width}px`;
			});
			tableWidth.value = `${sum}px`;
		} else {
			tableWidth.value = '100%';
			const columnWidthSum = measuredWidths.reduce((sum, w, i) => {
				const col = visibleColumns.value[i];
				return sum + (col ? Math.min(col.maxWidth || Infinity, Math.max(col.minWidth, w)) : w);
			}, 0);
			const widthRemaining = Math.max(0, totalWidth - columnWidthSum);
			columnWidths.value = measuredWidths.map((w, i) => {
				const col = visibleColumns.value[i];
				const width = Math.min(col?.maxWidth || Infinity, Math.max(col?.minWidth || 0, w));
				return `${(100 * (i === 0 ? width + widthRemaining : width)) / totalWidth}%`;
			});
		}
	}
	await nextTick();
	updateScrollState();
}

function handleColumnResize(i, width) {
	if (columnLayout.value !== 'px') {
		return;
	}
	const col = visibleColumns.value[i];
	const newWidth = Math.min(col?.maxWidth || 500, Math.max(col?.minWidth || 0, width));
	const oldWidth = parseFloat(columnWidths.value[i]);
	columnWidths.value[i] = `${newWidth}px`;
	tableWidth.value = `${parseFloat(tableWidth.value) + newWidth - oldWidth}px`;
	nextTick(() => updateScrollState());
}

function handleColumnsUpdate(columns: IGenericTableColumn[]) {
	localColumns.value = [...columns];
	recalculateColumnWidths();
	tableWidth.value = 'auto';
	emit('update:columns', columns);
}

function handleSectionsUpdate(sections: IGenericTableSection<T>[]) {
	localSections.value = [...sections];
	emit('update:sections', sections);
}

function handleUnsortedRowsUpdate(rows: IGenericTableRow<T>[]) {
	localUnsortedRows.value = [...rows];
	emit('update:unsorted-rows', rows);
}

function handleSortUpdate(config: ISortConfig) {
	localSortConfig.value = { ...config };
	recalculateColumnWidths();
	emit('update:sortConfig', config);
	emit('columnSorted', { columnKey: config.columnKey, direction: config.direction });
}

function handleRowMoved(payload: IDragDropEvent<T>) {
	if (payload.sectionId === 'unsorted') {
		const updatedRows = [...localUnsortedRows.value];
		if (payload.type === 'moved') {
			const [movedRow] = updatedRows.splice(payload.oldIndex!, 1);
			updatedRows.splice(payload.newIndex!, 0, movedRow);
		} else if (payload.type === 'added') {
			updatedRows.splice(payload.newIndex!, 0, payload.element!);
		} else if (payload.type === 'removed') {
			updatedRows.splice(payload.oldIndex!, 1);
		}
		handleUnsortedRowsUpdate(updatedRows);
	} else {
		const updatedSections = [...localSections.value];
		const section = updatedSections.find(s => s.id === payload.sectionId);
		if (section) {
			if (payload.type === 'added' && payload.element) {
				section.rows.splice(payload.newIndex!, 0, payload.element);
			} else if (payload.type === 'removed') {
				section.rows.splice(payload.oldIndex!, 1);
			} else if (payload.type === 'moved') {
				const [movedRow] = section.rows.splice(payload.oldIndex!, 1);
				section.rows.splice(payload.newIndex!, 0, movedRow);
			}
		}
		handleSectionsUpdate(updatedSections);
	}
	emit('rowMoved', payload);
}

function handleRowDeleted(payload: { rowId: string; sectionId?: string }) {
	if (isSectionedTable.value && payload.sectionId && payload.sectionId !== 'unsorted') {
		handleSectionsUpdate(localSections.value.map(s => s.id === payload.sectionId ? {
			...s,
			rows: s.rows.filter(r => r.id !== payload.rowId),
		} : s));
	} else {
		handleUnsortedRowsUpdate(localUnsortedRows.value.filter(r => r.id !== payload.rowId));
	}
	emit('rowDeleted', payload);
}

function handleSectionToggled(sectionId: string) {
	handleSectionsUpdate(localSections.value.map(s => s.id === sectionId ? { ...s, isCollapsed: !s.isCollapsed } : s));
	emit('sectionToggled', sectionId);
}

function handleSectionDeleted(sectionId: string) {
	handleSectionsUpdate(localSections.value.filter(s => s.id !== sectionId));
	emit('sectionDeleted', sectionId);
}

function handleSectionRenamed(payload: { sectionId: string; newName: string }) {
	handleSectionsUpdate(
		localSections.value.map(s => s.id === payload.sectionId ? { ...s, title: payload.newName } : s),
	);
	emit('sectionRenamed', payload);
}

function handleAnimationIteration() {
	if (shouldFinishAnimation.value) {
		isAnimating.value = false;
		shouldFinishAnimation.value = false;
	}
}

watch(() => props.columns, (c) => {
	localColumns.value = [...c];
	recalculateColumnWidths();
}, { deep: true });
watch(() => props.sections, (s) => {
	localSections.value = [...s];
	recalculateColumnWidths();
}, { deep: true });
watch(() => props.rows, (r) => {
	localUnsortedRows.value = [...r];
	recalculateColumnWidths();
}, { deep: true });
watch(() => props.sortConfig, (sc) => {
	localSortConfig.value = { ...sc };
	recalculateColumnWidths();
}, { deep: true });
watch(() => props.isFixedWidth, () => recalculateColumnWidths());
watch(() => props.backgroundColor, (nc) => {
	if (nc) {
		tableBackgroundColor.value = nc;
	}
});
watch(() => props.isUpdating, (v) => {
	if (v) {
		isAnimating.value = true;
		shouldFinishAnimation.value = false;
	} else {
		shouldFinishAnimation.value = true;
	}
}, { immediate: true });

let resizeObserver: ResizeObserver | null = null;
let onWinResize: (() => void) | null = null;

onMounted(() => {
	tableBackgroundColor.value =
		props.backgroundColor || (containerRef.value ? getRealBackgroundColor(containerRef.value.parentElement) : '');
	recalculateColumnWidths();
	if (containerRef.value && 'ResizeObserver' in window) {
		resizeObserver = new ResizeObserver(() => recalculateColumnWidths());
		resizeObserver.observe(containerRef.value);
	}
	onWinResize = () => recalculateColumnWidths();
	window.addEventListener('resize', onWinResize, { passive: true });
	nextTick(() => updateScrollState());
});

onUnmounted(() => {
	resizeObserver?.disconnect();
	if (onWinResize) {
		window.removeEventListener('resize', onWinResize);
	}
});
const rowsToRender = computed(()=>{
	if (isSectionedTable.value) {
		return [];
	}
	if (showHorizontalScrollbar.value&&props.noVerticalScroll) {
		return localUnsortedRows.value.slice(0, -1);
	}
	return localUnsortedRows.value;
});
</script>

<template>
	<div
		:class="classes.tableContainer"
		:style="{
			'--table-bg-color': tableBackgroundColor,
			'--table-bg-rgb': tableBgParts.rgb,
			'--table-bg-a': tableBgParts.a
		}"
	>
		<component :is="'style'">{{ scrollbarStyles }}</component>

		<div
			ref="containerRef"
			:class="[
				classes.scrollContainer,
				'custom-scrollbar-container',
				{ 'is-hovered': isContainerHovered },
				{ [classes.isAtStart]: !canScrollLeft && canScrollRight }
			]"
		>
			<div
				ref="scrollContainerRef"
				:class="['custom-scrollbar-content', classes.scrollContent]"
				@mouseenter="isContainerHovered = true"
				@mouseleave="isContainerHovered = false"
				@scroll="updateScrollState"
				@pointerdown.stop
			>

				<table
					ref="tableRef"
					:class="classes.dataTable"
					:style="{ 'table-layout': 'fixed', width: tableWidth }"
				>
					<generic-grid-header
						v-if="props.showHeader"
						:columns="visibleColumns"
						:column-widths="columnWidths"
						:all-columns="localColumns"
						:sort-config="localSortConfig"
						:enable-reordering="enableColumnReordering"
						:enable-resizing="columnLayout==='px'"
						:enable-sorting="enableSorting"
						:enable-column-settings="enableColumnSettings"
						:enable-row-actions="enableRowActions"
						:sticky="stickyHeader"
						:sticky-first-column="isFirstReallySticky"
						:bg-color="tableBackgroundColor"
						@update:columns="handleColumnsUpdate"
						@update:sort="handleSortUpdate"
						@update:column-width="handleColumnResize"
					>
						<template
							v-for="(column, index) in visibleColumns"
							:key="column.key"
							#[`header-${index}`]="headerProps"
						>
							<slot :name="`header-${column.key}`" v-bind="headerProps">
								<slot :name="`header-${index}`" v-bind="headerProps">
									{{ column.label }}
								</slot>
							</slot>
						</template>
						<template v-if="isFirstReallySticky && $slots['first-column-settings']" #first-column-settings>
							<slot name="first-column-settings" />
						</template>
					</generic-grid-header>

					<unified-table-content
						:sections="isSectionedTable ? localSections : []"
						:rows="rowsToRender"
						:columns="visibleColumns"
						:column-widths="columnWidths"
						:sort-config="localSortConfig"
						:can-add-sections="canAddSections"
						:enable-drag-drop="enableDragDrop"
						:sticky-first-column="isFirstReallySticky"
						:enable-row-actions="enableRowActions"
						:enable-column-settings="enableColumnSettings"
						@update:sections="handleSectionsUpdate"
						@update:rows="handleUnsortedRowsUpdate"
						@row-moved="handleRowMoved"
						@row-deleted="handleRowDeleted"
						@section-toggled="handleSectionToggled"
						@section-added="emit('sectionAdded', $event)"
						@section-deleted="handleSectionDeleted"
						@section-renamed="handleSectionRenamed"
						@click-on-row="emit('click-on-row', $event)"
					>
						<template
							v-for="(column, index) in visibleColumns"
							:key="column.key"
							#[`cell-${index}`]="cellProps"
						>
							<slot :name="`cell-${column.key}`" v-bind="cellProps">
								<slot :name="`cell-${index}`" v-bind="cellProps">
									{{ cellProps.row.data[column.key] }}
								</slot>
							</slot>
						</template>
						<template #section-header="sectionProps">
							<slot name="section-header" v-bind="sectionProps">{{ sectionProps.section.title }}</slot>
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

				<div
					v-if="isAnimating"
					:class="classes.loadingIndicatorContainer"
					@animationiteration="handleAnimationIteration"
				>
					<div :class="classes.loadingIndicator"></div>
				</div>
			</div>

			<div
				v-if="showVerticalScrollbar"
				ref="verticalTrackRef"
				class="custom-scrollbar-track vertical"
				:class="[
					classes.staticVerticalTrack,
					{'with-horizontal': showHorizontalScrollbar,
						'show-on-hover': props.showScrollbarsOnHover,
						'is-dragging': isDraggingVertical
					}]"
				@click="handleVerticalTrackClick"
				@pointerdown.stop
			>
				<div
					class="custom-scrollbar-thumb vertical"
					:class="[{ dragging: isDraggingVertical },classes.staticVerticalThumb]"
					:style="{ top: `${scrollbarConfig.grabAreaPadding + verticalThumbTop}px` }"
					@pointerdown="handleVerticalMouseDown"
				/>
			</div>
		</div>

		<div
			v-if="showHorizontalScrollbar"
			:class="classes.footerControls"
			@stop.prevent
			@pointerdown.stop
		>

			<button
				:disabled="!canScrollLeft"
				:class="classes.arrow"
				@click="scrollTable('left')"
			>
				<ui-icon
					:id="IconIds.DropdownDown"
					:class="[classes.arrowLeft]"
					height="16px"
				/>
			</button>


			<div
				ref="horizontalTrackRef"
				class="custom-scrollbar-track horizontal"
				:class="[{
					'is-dragging': isDraggingHorizontal,
					'with-horizontal': showVerticalScrollbar,
					[classes.staticHorizontalTrack]: true
				}]"
				@click="handleHorizontalTrackClick"
			>
				<div
					class="custom-scrollbar-thumb horizontal"
					:class="[{ dragging: isDraggingHorizontal }, classes.staticHorizontalThumb]"
					:style="{ left: `${scrollbarConfig.grabAreaPadding + horizontalThumbLeft}px` }"
					@mousedown="handleHorizontalMouseDown"
				/>
			</div>
			<button
				:disabled="!canScrollRight"
				:class="classes.arrow"
				@click="scrollTable('right')"
			>
				<ui-icon
					:id="IconIds.DropdownDown"
					:class="[classes.arrowRight]"
					height="16px"
				/>
			</button>
		</div>

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
	min-height: 0;
	overflow: hidden;
}

.scrollContainer {
	position: relative;
	flex: 1;
	min-height: 0;
	overflow: hidden;
	background: var(--table-bg-color, #ffffff);
}

.scrollContent {
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	overflow-x: hidden;
	overflow-y: auto;
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
	width: 100%;
	border-collapse: collapse;
	table-layout: fixed;
	background: var(--table-bg-color);
}

.paginationWrapper {
	flex-shrink: 0;
	padding: 16px 0;
	background: var(--bg-color-surface-01, #1a1a1a);
}

.buttonsWrapper {
	display: flex;
	gap: 8px;
	flex-shrink: 0;
}

.footerControls {
	position: relative;
	z-index: 2;
	display: flex;
	flex-shrink: 0;
	align-items: center;
	box-sizing: border-box;
	height: 36px;
	padding: 8px 16px;
	background: var(--table-bg-color, #ffffff);
	gap: 16px;
}

.staticVerticalTrack {
	background: transparent !important;
	border-radius: 4px;
	transform: translateX(10px);

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 10px;
		width: 2px;
		height: 100%;
		background: var(--bg-100, rgb(73 73 80 / 32%));
	}
}

.staticVerticalThumb {
	z-index: 2;
	background: transparent !important;
	border: none !important;

	&::after {
		content: '';
		position: absolute;
		top: 0;
		left: 10px;
		width: 2px;
		height: 100%;
		background: var(--icon-300, rgb(255 255 255 / 50%));
		border-radius: 8px;
	}
}

.staticHorizontalTrack {
	position: relative !important;
	bottom: auto !important;
	left: auto !important;
	flex: 1;
	padding: 0 !important;
	background: transparent !important;
	visibility: visible !important;
	opacity: 1 !important;

	&::after {
		content: '';
		position: absolute;
		top: 10px;
		left: 0;
		width: 100%;
		height: 2px;
		background: var(--bg-100, rgb(73 73 80 / 32%));
		border-radius: 4px;
	}
}

.staticHorizontalThumb {
	z-index: 2;
	background: transparent !important;
	border: none !important;
	visibility: visible !important;
	opacity: 1 !important;

	&::after {
		content: '';
		position: absolute;
		top: 10px;
		left: 0;
		width: 100%;
		height: 2px;
		background: var(--icon-300, rgb(255 255 255 / 50%));
		border-radius: 8px;
	}
}

.arrow {
	padding: 0;
	color: var(--icon-300, rgb(255 255 255 / 50%));
	cursor: pointer;

	.arrowLeft {
		transform: rotate(90deg) translateX(2px);
	}

	.arrowRight {
		transform: rotate(-90deg) translateX(-2px);
	}
}
</style>

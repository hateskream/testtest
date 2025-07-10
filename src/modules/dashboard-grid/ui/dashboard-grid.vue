<script setup lang="ts">
import {
	computed,
	createApp,
	onBeforeUnmount,
	reactive,
	ref,
	watch,
	type App,
} from 'vue';
import { GridLayout } from 'grid-layout-plus';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { throttle, debounce } from '@vexip-ui/utils';

import {
	useInjectCanDelete,
	useInjectCurrentDashboardInject,
	useInjectSetterDndHandler,
	useMousePositionSync,
	useRebuildingGrid,
} from '../composables';
import {
	type IWidget,
	type IMeta,
	type IPosition as WidgetPosition,
} from '@/modules/dashboard-group';
import { queryClient } from '@/shared/service/query-client';
import { CurrentDashboardSymbol } from '../model';
import type { IPosition } from '../model';
import type { ISize, IWidgetState, WidgetType } from '@/modules/dashboard-group/model';

import DashboardGridElement from './dashboard-grid-element.vue';
import PlaceholderComponent from './placeholder-component.vue';
import GhostMoveComponent from './ghost-move-component.vue';
import PlaceholderResizeComponent from './placeholder-resize-component.vue';
import PlaceholderDndComponent from './placeholder-dnd-component.vue';

interface IGridState {
	isDnd: boolean;
	isResize: boolean;
	isUserInteracted: boolean;
	isAddWidget: boolean;
}

interface IGridLayoutComponent {
	widgets: IWidget[];
	isDnd: boolean;
	columnsNum: number;
	rowsNum: number;
	rowHeight: number;
	columnWidth: number;
}

const props = defineProps<IGridLayoutComponent>();

const emit = defineEmits<{
	(e: 'update-is-show-grid-state', value: boolean): void;
	(e: 'add-widget', type: WidgetType, position: WidgetPosition, widgetsState: IWidgetState[]): void;
	(e: 'delete-widget', widgetId: string, widgetsState: IWidgetState[]): void;
	(e: 'change-dashboard-state', widgetsState: IWidgetState[]): void;
}>();


let mountedPlaceholder: App<Element> | null = null;

const widgetIdToSize = ref(new Map<string, ISize>());

const { currentDashboard } = useInjectCurrentDashboardInject();

const { dnDProvider } = useInjectSetterDndHandler();

const { canDelete } = useInjectCanDelete();

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout> | null>(null);

const gridState = reactive<IGridState>({
	isDnd: false,
	isResize: false,
	isUserInteracted: false,
	isAddWidget: false,
});

const resizableWidgetId = ref<string | null>(null);
const dndWidgetId = ref<string | null>(null);

const isEmpty = computed(() => props.widgets.length === 0);
const isEditable = computed(() => !isEmpty.value || gridState.isAddWidget);

const rawDashboards = computed((): IPosition[] =>
	isEmpty.value ?
		generateEmptyGrid(props.columnsNum, props.rowsNum) :
		props.widgets.map(el => ({ ...el.position, i: el.id })),

);

function generateEmptyGrid(columnsNum: number, rowsNum: number): IPosition[] {
	return Array.from({ length: rowsNum * columnsNum }, (_, index) => ({
		x: index % columnsNum,
		y: Math.floor(index / columnsNum),
		w: 1,
		h: 1,
		i: String(index + Date.now()),
	}));
}

const columnsNum = computed(() => props.columnsNum);
const rowsNum = computed(() => props.rowsNum);

const { layout } = useRebuildingGrid(columnsNum, rowsNum, rawDashboards);

const { mouseAt } = useMousePositionSync();
const dropId = '-1';
const dragItem = ref<IPosition>({ x: -1, y: -1, w: 2, h: 2, i: '' });

watch(
	layout,
	initializeWidgetIdToSize,
	{
		deep: true,
		immediate: true,
	},
);

watch(
	() => gridState.isUserInteracted,
	() => emit('update-is-show-grid-state', false),
);

watch([
	() => gridState.isDnd,
	() => gridState.isResize,
	() => gridState.isAddWidget,
], ([isDnd, isResize, isAddWidget]) =>
	emit('update-is-show-grid-state', isDnd || isResize || isAddWidget),
);

watch(
	() => gridState.isDnd,
	isDnd => {
		if (isDnd) {
			mountPlaceholderDnD();
		} else {
			unmountPlaceholderComponents();
		}
	},
);

watch(
	() => gridState.isResize,
	isResize => {
		if (isResize) {
			mountPlaceholderResize();
		} else {
			unmountPlaceholderComponents();
		}
	},
);

watch(widgetIdToSize, () => {
	unmountPlaceholderComponents();
	mountPlaceholderResize();
}, { deep: true });

watch(() => dnDProvider.newDashboard.value, newValue => {
	if (newValue) {
		dragItem.value.w = newValue.defaultSize.w;
		dragItem.value.h = newValue.defaultSize.h;
	}
});

watch(
	() => canDelete.value,
	newValue => {
		if (newValue && dndWidgetId.value !== null) {
			deleteDashboards(dndWidgetId.value);
		}
	},
);

function onCreated() {
	dnDProvider.setDrag(throttle(handlerDrag));
	dnDProvider.setDragEnd(debounce(handlerDragEnd));
}

onBeforeUnmount(unmountPlaceholderComponents);

function getDashboardItemById(id: string): IWidget {
	const foundDashboard = props.widgets.find(item => item.id === id);
	if (foundDashboard) {
		return foundDashboard;
	}

	throw new Error(`Dashboard with id ${id} not found 1`);
}

function getMaxSize(id: string): { w: number; h: number } {
	if (isEmpty.value) {
		return {
			w: 1,
			h: 1,
		};
	}

	if (gridState.isAddWidget) {
		if (!dnDProvider.newDashboard.value) {
			throw new Error('newDashboard is null');
		}

		return dnDProvider.newDashboard.value.maxSize;
	}

	const foundDashboard = props.widgets.find(item => item.id === id);

	if (!foundDashboard) {
		throw new Error(`Dashboard with id ${id} not found 2`);
	}

	return {
		w: foundDashboard.maxSize.w,
		h: foundDashboard.maxSize.h,
	};
}

function getMinSize(id: string): { w: number; h: number } {
	if (isEmpty.value) {
		return {
			w: 1,
			h: 1,
		};
	}

	if (gridState.isAddWidget) {
		if (!dnDProvider.newDashboard.value) {
			throw new Error('newDashboard is null');
		}

		return dnDProvider.newDashboard.value.minSize;
	}

	const foundDashboard = props.widgets.find(item => item.id === id);

	if (!foundDashboard) {
		throw new Error(`Dashboard with id ${id} not found 2`);
	}

	return {
		w: foundDashboard.minSize.w,
		h: foundDashboard.minSize.h,
	};
}

function getMeta(id: string, isResizing = false): IMeta {
	const foundDashboard = props.widgets.find(item => item.id === id);

	if (!foundDashboard) {
		throw new Error(`Dashboard with id ${id} not found 2`);
	}

	const size = widgetIdToSize.value.get(id);

	if (!size) {
		throw new Error(`Dashboard with id ${id} not found size`);
	}

	return {
		market: '',
		name: foundDashboard.name,
		isResizing,
		size,
	};
}

function mountPlaceholderResize() {
	if (resizableWidgetId.value === null) {
		return;
	}

	mountedPlaceholder = createApp(PlaceholderResizeComponent, {
		dashboardItem: getDashboardItemById(resizableWidgetId.value),
		meta: getMeta(resizableWidgetId.value, true),
	});

	mountedPlaceholder.provide(CurrentDashboardSymbol, currentDashboard);

	mountedPlaceholder.use(VueQueryPlugin, { queryClient });

	mountPlaceholderComponents(mountedPlaceholder);
}

function mountPlaceholderDnD() {
	mountedPlaceholder = createApp(PlaceholderDndComponent);
	mountPlaceholderComponents(mountedPlaceholder);
}

function mountPlaceholderComponents(placeholderComponent: App<Element>) {
	if (!gridLayoutRef.value) {
		return;
	}

	const placeholder = gridLayoutRef.value.$el.querySelector(
		'.dashboard-grid > .vgl-item--placeholder',
	);

	if (!(placeholder instanceof HTMLElement)) {
		return;
	}

	placeholderComponent.mount(placeholder);
}

function unmountPlaceholderComponents() {
	if (mountedPlaceholder) {
		mountedPlaceholder.unmount();
		mountedPlaceholder = null;
	}
}

function updated() {
	if (!gridState.isUserInteracted) {
		gridState.isUserInteracted = true;

		return;
	}
}

function onChangeDndState(newValue: boolean) {
	gridState.isDnd = newValue;
}

function onChangeResizeState(newValue: boolean) {
	gridState.isResize = newValue;
}

function setResizableWidgetId(id: string | null) {
	resizableWidgetId.value = id;
}

function setDndWidgetId(id: string | null) {
	dndWidgetId.value = id;
}

function handlerDrag() {
	gridState.isAddWidget = true;
	const parentRect = wrapperRef.value?.getBoundingClientRect();

	if (!parentRect || !gridLayoutRef.value) {
		return;
	}

	const mouseInGrid =
		mouseAt.x > parentRect.left - 20 &&
		mouseAt.x < parentRect.right - 20 &&
		mouseAt.y > parentRect.top - 20 &&
		mouseAt.y < parentRect.bottom - 20;

	if (mouseInGrid && !layout.value.find(item => item.i === dropId)) {
		const centerX = Math.floor(columnsNum.value / 2) - Math.floor(dragItem.value.w / 2);
		const centerY = Math.floor(rowsNum.value / 2) - Math.floor(dragItem.value.h / 2);
		layout.value.push({
			x: Math.max(0, Math.min(centerX, columnsNum.value - dragItem.value.w)),
			y: Math.max(0, Math.min(centerY, rowsNum.value - dragItem.value.h)),
			w: dragItem.value.w,
			h: dragItem.value.h,
			i: dropId,
		});
	}

	const index = layout.value.findIndex(item => item.i === dropId);

	if (index !== -1) {
		const item = gridLayoutRef.value.getItem(dropId);

		if (!item) {
			return;
		}

		const offsetX = (dragItem.value.w * props.columnWidth) / 2;
		const offsetY = (dragItem.value.h * props.rowHeight) / 2;
		Object.assign(item.state, {
			top: mouseAt.y - parentRect.top - offsetY,
			left: mouseAt.x - parentRect.left - offsetX,
		});

		const newPos = item.calcXY(
			mouseAt.y - parentRect.top - offsetY,
			mouseAt.x - parentRect.left - offsetX,
		);

		if (mouseInGrid) {
			gridLayoutRef.value.dragEvent(
				'dragstart',
				dropId,
				newPos.x,
				newPos.y,
				dragItem.value.h,
				dragItem.value.w,
			);
			dragItem.value.i = index as unknown as string;
			dragItem.value.x = layout.value[index].x;
			dragItem.value.y = layout.value[index].y;
		} else {
			gridLayoutRef.value.dragEvent(
				'dragend',
				dropId,
				newPos.x,
				newPos.y,
				dragItem.value.h,
				dragItem.value.w,
			);
			layout.value = layout.value.filter(el => el.i !== dropId);
		}
	}
}

function handlerDragEnd() {
	gridState.isAddWidget = false;
	const parentRect = wrapperRef.value?.getBoundingClientRect();

	if (!parentRect || !gridLayoutRef.value) {
		layout.value = layout.value.filter(item => item.i !== dropId);
		return;
	}

	const mouseInGrid =
		mouseAt.x > parentRect.left &&
		mouseAt.x < parentRect.right &&
		mouseAt.y > parentRect.top &&
		mouseAt.y < parentRect.bottom;

	if (mouseInGrid) {
		const placeholder = layout.value.find(item => item.i === dropId);

		if (!placeholder) {
			// eslint-disable-next-line no-console
			console.warn('Placeholder not found in layout:', dropId);
			layout.value = layout.value.filter(item => item.i !== dropId);
			return;
		}

		const finalX = Math.max(0, Math.min(placeholder.x, columnsNum.value - dragItem.value.w));
		const finalY = Math.max(0, Math.min(placeholder.y, rowsNum.value - dragItem.value.h + 1));

		layout.value = layout.value.filter(el => el.i !== dropId);

		const newItemId = String(Date.now());

		const position: IPosition = {
			x: finalX,
			y: finalY,
			w: dragItem.value.w,
			h: dragItem.value.h,
			i: newItemId,
		};

		if (!dnDProvider.newDashboard.value) {
			throw new Error('newDashboard is null');
		}

		gridLayoutRef.value.dragEvent('dragend', newItemId, finalX, finalY, dragItem.value.h, dragItem.value.w);

		if (isEmpty.value) {
			emit('add-widget',
				dnDProvider.newDashboard.value.widgetType,
				position,
				[],
			);

			return;
		}

		emit('add-widget',
			dnDProvider.newDashboard.value.widgetType,
			position,
			mapToWidgetState(layout.value.filter(item => item.i !== newItemId)),
		);
	} else {
		layout.value = layout.value.filter(item => item.i !== dropId);
	}
}

function mapToWidgetState(positions: IPosition[]): IWidgetState[] {
	return positions.map(item => ({
		position: item,
		id: item.i,
	}));
}

function deleteDashboards(widgetId: string) {
	if (!gridLayoutRef.value) {
		// eslint-disable-next-line no-console
		console.warn('GridLayoutRef is not available');
		return;
	}

	gridLayoutRef.value.dragEvent('dragend', widgetId, 0, 0, 0, 0);
	gridState.isDnd = false;
	dndWidgetId.value = null;

	emit(
		'delete-widget',
		widgetId,
		mapToWidgetState(layout.value.filter(item => item.i !== widgetId)),
	);
}

function findDashboardItemById(id: string):IWidget | undefined {
	return props.widgets.find(item => item.id === id);
}

function initializeWidgetIdToSize(positions: IPosition[]) {
	positions.forEach(setValueInWidgetIdToSize);
}

function setValueInWidgetIdToSize(position: IPosition) {
	const size: ISize = {
		h: position.h,
		w: position.w,
	};

	const lastValue = widgetIdToSize.value.get(position.i);

	if (!lastValue || lastValue.h !== size.h || lastValue.w !== size.w) {
		widgetIdToSize.value.set(position.i, size);
	}
}

function onResize(i: string, newH: number, newW: number) {
	const foundDashboard = findDashboardItemById(i);

	if (!foundDashboard) {
		throw new Error(`Dashboard with id ${i} not found onResize`);
	}

	const updatedPosition = {
		...foundDashboard.position,
		h: newH,
		w: newW,
		i: foundDashboard.id,
	};

	setValueInWidgetIdToSize(updatedPosition);
}

function updateLayout() {
	emit('change-dashboard-state', mapToWidgetState(layout.value));
}

onCreated();
</script>

<template>
	<div
		ref="wrapperRef"
		@dragover.prevent
	>
		<grid-layout
			ref="gridLayoutRef"
			:layout="layout"
			:col-num="columnsNum"
			:row-height="rowHeight"
			:is-draggable="isEditable"
			:is-resizable="isEditable"
			:prevent-collision="false"
			:use-css-transforms="false"
			:margin="[0, 0]"
			class="dashboard-grid"
			@layout-updated="updated"
		>
			<dashboard-grid-element
				v-for="item in layout"
				:key="item.i"
				:x="item.x"
				:y="item.y"
				:w="item.w"
				:h="item.h"
				:i="item.i"
				:max-h="getMaxSize(item.i).h"
				:max-w="getMaxSize(item.i).w"
				:min-h="getMinSize(item.i).h"
				:min-w="getMinSize(item.i).w"
				:is-editing="props.isDnd"
				:drop-id="dropId"
				@change-dnd-state="onChangeDndState"
				@change-resize-state="onChangeResizeState"
				@set-resizable-widget-id="setResizableWidgetId"
				@set-dnd-widget-id="setDndWidgetId"
				@resize="onResize"
				@moved="updateLayout"
				@delete="deleteDashboards"
			>
				<template #state-calm>
					<slot
						v-if="!isEmpty"
						name="dashboard-content"
						:dashboard-item="getDashboardItemById(item.i)"
						:meta="getMeta(item.i)"
					/>
					<div v-else class="mock" />
				</template>
				<template #state-dnd>
					<ghost-move-component :title="getDashboardItemById(item.i).name" />
				</template>
				<template #state-resize>
					<placeholder-component />
				</template>
				<template #state-add-widget>
					<placeholder-component />
				</template>
			</dashboard-grid-element>
		</grid-layout>
	</div>
</template>

<style scoped>
.mock {
	width: 100%;
	height: 100%;
	background-color: transparent;
}

:deep(.vgl-layout) {
	opacity: 1 !important;
	transition: none;
	touch-action: none;

	--vgl-item-resizing-opacity: 100% !important;
}

:deep(.vgl-item:not(.vgl-item--placeholder)) {
	user-select: none;
}

:deep(.vgl-item--placeholder .vgl-item__resizer) {
	display: none !important;
}

:deep(.vgl-item__resizer) {
	right: 0 !important;
	bottom: 0 !important;
	z-index: 100 !important;
	width: 40px !important;
	height: 40px !important;
	opacity: 0;
}

:deep(.vgl-item--placeholder) {
	background-color: transparent !important;
	opacity: 1 !important;
}
</style>

<script setup lang="ts">
import {
	computed,
	createApp,
	inject,
	onBeforeUnmount,
	reactive,
	ref,
	watch,
	type App,
	type Ref,
} from 'vue';
import { GridLayout } from 'grid-layout-plus';
import { VueQueryPlugin } from '@tanstack/vue-query';
import { throttle, debounce } from '@vexip-ui/utils';

import { useInjectCurrentDashboardInject, useMousePositionSync, useRebuildingGrid } from '../composables';
import {
	type IDashboardFolder,
	type IDashboardGroup,
	type IDashboardInstance,
	type IDashboardItem,
	type IDashboardStack,
	type IMeta,
} from '@/modules/dashboard-group';
import { queryClient } from '@/shared/service/query-client';
import { CurrentDashboardSymbol } from '../model';
import type { IPosition } from '../model';

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
	dashboards: IDashboardGroup;
	isDnd: boolean;
	columnsNum: number;
	rowsNum: number;
	rowHeight: number;
	columnWidth: number;
}

const props = defineProps<IGridLayoutComponent>();

const emit = defineEmits<{
	(e: 'update-is-show-grid-state', value: boolean): void;
	(e: 'setWrapper', value: HTMLDivElement): void;
	(e: 'setGridLayoutRef', value: InstanceType<typeof GridLayout>): void;
	(e: 'add-widget', newItems: (IDashboardInstance | IDashboardFolder | IDashboardStack)[]): void;
}>();


let mountedPlaceholder: App<Element> | null = null;

interface IFuncs {
	setDrag(func: () => void): void;
	setDragEnd(func: () => void): void;
	newDashboard: Ref<IDashboardInstance | null>;
	isIn: Ref<boolean, boolean>;
}

const funcSetter =	inject('funcSetter') as IFuncs;

const { currentDashboard } = useInjectCurrentDashboardInject();

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout> | null>(null);

const gridState = reactive<IGridState>({
	isDnd: false,
	isResize: false,
	isUserInteracted: false,
	isAddWidget: false,
});

const resizableWidgetId = ref<number | null>(null);
const dndWidgetId = ref<number | null>(null);

const isEmpty = computed(() => props.dashboards.items.length === 0);

const rawDashboards = computed((): IPosition[] =>
	isEmpty.value ?
		generateEmptyGrid(props.columnsNum, props.rowsNum) :
		props.dashboards.items.map(el => ({ ...el.position, i: el.id })),

);

function generateEmptyGrid(columnsNum: number, rowsNum: number): IPosition[] {
	return Array.from({ length: rowsNum * columnsNum }, (_, index) => ({
		x: index % columnsNum,
		y: Math.floor(index / columnsNum),
		w: 1,
		h: 1,
		i: index + Date.now(),
	}));
}

const columnsNum = computed(() => props.columnsNum);
const rowsNum = computed(() => props.rowsNum);

const { layout } = useRebuildingGrid(columnsNum, rowsNum, rawDashboards);

const { mouseAt } = useMousePositionSync();
const dropId = -1;
const dragItem = { x: -1, y: -1, w: 2, h: 2, i: '' };

watch(
	wrapperRef,
	value => {
		if (value) {
			emit('setWrapper', value);
		}
	},
	{
		once: true,
	},
);

watch(
	gridLayoutRef,
	value => {
		if (value) {
			emit('setGridLayoutRef', value);
		}
	},
	{
		once: true,
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

watch(() => funcSetter.newDashboard.value, () => {
	if (funcSetter.newDashboard.value) {
		dragItem.w = funcSetter.newDashboard.value.minSize.w;
		dragItem.h = funcSetter.newDashboard.value.minSize.h;
	}
});

watch(
	() => funcSetter.isIn.value,
	isIn => {
		if (isIn && dndWidgetId.value !== null) {
			deleteDashboards(dndWidgetId.value);
		}
	},
);

function onCreated() {
	funcSetter.setDrag(throttle(handlerDrag));
	funcSetter.setDragEnd(debounce(handlerDragEnd));
}

onBeforeUnmount(unmountPlaceholderComponents);

function getDashboardItemById(id: number): IDashboardItem {
	const foundDashboard = props.dashboards.items.find(item => item.id === id);
	if (foundDashboard) {
		return foundDashboard;
	}

	throw new Error(`Dashboard with id ${id} not found 1`);
}

function getMaxSize(id: number): { w: number; h: number } {
	if (isEmpty.value) {
		return {
			w: 1,
			h: 1,
		};
	}

	if (gridState.isAddWidget) {
		if (!funcSetter.newDashboard.value) {
			throw new Error('newDashboard is null');
		}

		return funcSetter.newDashboard.value.maxSize;
	}

	const foundDashboard = props.dashboards.items.find(item => item.id === id);

	if (!foundDashboard) {
		throw new Error(`Dashboard with id ${id} not found 2`);
	}

	return {
		w: foundDashboard.maxSize.w,
		h: foundDashboard.maxSize.h,
	};
}

function getMinSize(id: number): { w: number; h: number } {
	if (isEmpty.value) {
		return {
			w: 1,
			h: 1,
		};
	}

	if (gridState.isAddWidget) {
		if (!funcSetter.newDashboard.value) {
			throw new Error('newDashboard is null');
		}

		return funcSetter.newDashboard.value.minSize;
	}

	const foundDashboard = props.dashboards.items.find(item => item.id === id);

	if (!foundDashboard) {
		throw new Error(`Dashboard with id ${id} not found 2`);
	}

	return {
		w: foundDashboard.minSize.w,
		h: foundDashboard.minSize.h,
	};
}

function getMeta(id: number, isResizing = false): IMeta {
	const foundDashboard = props.dashboards.items.find(item => item.id === id);

	if (!foundDashboard) {
		throw new Error(`Dashboard with id ${id} not found 2`);
	}

	return {
		market: '',
		name: foundDashboard.name,
		isResizing,
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
	}
}

function onChangeDndState(newValue: boolean) {
	gridState.isDnd = newValue;
}

function onChangeResizeState(newValue: boolean) {
	gridState.isResize = newValue;
}

function setResizableWidgetId(id: number | null) {
	resizableWidgetId.value = id;
}

function setDndWidgetId(id: number | null) {
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
		const centerX = Math.floor(columnsNum.value / 2) - Math.floor(dragItem.w / 2);
		const centerY = Math.floor(rowsNum.value / 2) - Math.floor(dragItem.h / 2);
		layout.value.push({
			x: Math.max(0, Math.min(centerX, columnsNum.value - dragItem.w)),
			y: Math.max(0, Math.min(centerY, rowsNum.value - dragItem.h)),
			w: dragItem.w,
			h: dragItem.h,
			i: dropId,
		});
	}

	const index = layout.value.findIndex(item => item.i === dropId);

	if (index !== -1) {
		const item = gridLayoutRef.value.getItem(dropId);

		if (!item) {
			return;
		}

		const offsetX = (dragItem.w * props.columnWidth) / 2;
		const offsetY = (dragItem.h * props.rowHeight) / 2;
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
				dragItem.h,
				dragItem.w,
			);
			dragItem.i = index as unknown as string;
			dragItem.x = layout.value[index].x;
			dragItem.y = layout.value[index].y;
		} else {
			gridLayoutRef.value.dragEvent(
				'dragend',
				dropId,
				newPos.x,
				newPos.y,
				dragItem.h,
				dragItem.w,
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
			console.warn('Placeholder not found in layout:', dropId);
			layout.value = layout.value.filter(item => item.i !== dropId);
			return;
		}

		const finalX = Math.max(0, Math.min(placeholder.x, columnsNum.value - dragItem.w));
		const finalY = Math.max(0, Math.min(placeholder.y, rowsNum.value - dragItem.h + 1));

		layout.value = layout.value.filter(el => el.i !== dropId);

		const newItemId = Date.now();

		const position: IPosition = {
			x: finalX,
			y: finalY,
			w: dragItem.w,
			h: dragItem.h,
			i: newItemId,
		};

		if (!funcSetter.newDashboard.value) {
			throw new Error('newDashboard is null');
		}

		const newItems: IDashboardInstance = {
			...funcSetter.newDashboard.value,
			position,
		};

		emit('add-widget', [newItems, ...updateDashboardItemsPositions(props.dashboards.items, layout.value)]);

		gridLayoutRef.value.dragEvent('dragend', newItemId, finalX, finalY, dragItem.h, dragItem.w);


	} else {
		layout.value = layout.value.filter(item => item.i !== dropId);
	}
}

function updateDashboardItemsPositions(
	dashboardItems: (IDashboardInstance | IDashboardFolder | IDashboardStack)[],
	positions: IPosition[],
): (IDashboardInstance | IDashboardFolder | IDashboardStack)[] {
	return dashboardItems.map(item => {
		const matchingPosition = positions.find(pos => pos.i === item.id);
		if (matchingPosition) {
			return {
				...item,
				position: {
					x: matchingPosition.x,
					y: matchingPosition.y,
					w: matchingPosition.w,
					h: matchingPosition.h,
				},
			};
		}
		return item;
	});
}

function deleteDashboards(widgetId: number) {
	if (!gridLayoutRef.value) {
		console.warn('GridLayoutRef is not available');
		return;
	}

	const updatedDashboards = props.dashboards.items.filter(item => item.id !== widgetId);


	gridLayoutRef.value.dragEvent('dragend', widgetId, 0, 0, 0, 0);
	gridState.isDnd = false;
	dndWidgetId.value = null;

	emit('add-widget', updatedDashboards);
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
			:is-draggable="true"
			:is-resizable="true"
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

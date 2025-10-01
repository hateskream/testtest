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
	useInjectSetterDndHandler,
	useMousePositionSync,
	useLayout,
} from '../composables';
import {
	type IWidget,
	type IPosition as WidgetPosition,
} from '@/modules/dashboard-group/core';
import { queryClient } from '@/shared/service/query-client';
import { CurrentDashboardSymbol } from '../model';
import type { IPosition } from '../model';
import type { IWidgetState, WidgetType } from '@/modules/dashboard-group/core';
import { CurrentDashboard } from '@/modules/dashboard-group/dashboards';
import { mapToWidgetState } from '../utils';

import DashboardGridElement from './dashboard-grid-element.vue';
import PlaceholderComponent from './placeholder-component.vue';
import GhostMoveComponent from './ghost-move-component.vue';
import PlaceholderResizeComponent from './placeholder-resize-component.vue';
import PlaceholderDndComponent from './placeholder-dnd-component.vue';

const MOUNT_TARGET_ID = 'placeholder-mount-target';

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

const columnsNum = computed(() => props.columnsNum);
const rowsNum = computed(() => props.rowsNum);
const rawWidgets = computed(() => props.widgets);

const {
	layout,
	isEmpty,
	hasDropId,
	checkIsFake,
	DROP_ID,
	addDropEl,
	indexDropIdEl,
	deleteDropEl,
	dropEl,
} = useLayout(columnsNum, rowsNum, rawWidgets);

const isEditable = computed(() => !isEmpty.value || gridState.isAddWidget);

const { mouseAt } = useMousePositionSync();
const dragItem = ref<IPosition>({ x: -1, y: -1, w: 2, h: 2, i: '' });

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
	dnDProvider.setDrag(throttle(handlerDrag, 100));
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
	if (checkIsFake(id)) {
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
	if (checkIsFake(id)) {
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

function mountPlaceholderResize() {
	if (resizableWidgetId.value === null) {
		return;
	}

	mountedPlaceholder = createApp(PlaceholderResizeComponent, {
		dashboardItem: getDashboardItemById(resizableWidgetId.value),
	});

	mountedPlaceholder.provide(CurrentDashboardSymbol, CurrentDashboard);

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

	const el = gridLayoutRef.value.$el as HTMLElement;

	const placeholder = el.querySelector(
		'.dashboard-grid > .vgl-item--placeholder',
	);

	if (!(placeholder instanceof HTMLElement)) {
		return;
	}

	const mountTarget = document.createElement('div');
	mountTarget.id = MOUNT_TARGET_ID;
	mountTarget.style.height = '100%';

	placeholder.appendChild(mountTarget);

	placeholderComponent.mount(mountTarget);
}

function unmountPlaceholderComponents() {
	if (!mountedPlaceholder) {
		return;
	}

	mountedPlaceholder.unmount();
	mountedPlaceholder = null;

	const mountTarget = document.getElementById(MOUNT_TARGET_ID);
	if (mountTarget && mountTarget.parentNode) {
		mountTarget.parentNode.removeChild(mountTarget);
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
		mouseAt.y > parentRect.top - 20;

	if (mouseInGrid && !hasDropId.value) {
		const centerX = Math.floor(columnsNum.value / 2) - Math.floor(dragItem.value.w / 2);
		const centerY = Math.floor(rowsNum.value / 2) - Math.floor(dragItem.value.h / 2);

		addDropEl(
			Math.max(0, Math.min(centerX, columnsNum.value - dragItem.value.w)),
			Math.max(0, Math.min(centerY, rowsNum.value - dragItem.value.h)),
			dragItem.value.w,
			dragItem.value.h,
		);
	}

	if (indexDropIdEl.value !== -1) {
		const item = gridLayoutRef.value.getItem(DROP_ID);

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
				DROP_ID,
				newPos.x,
				newPos.y,
				dragItem.value.h,
				dragItem.value.w,
			);
			dragItem.value.i = indexDropIdEl.value as unknown as string;
			dragItem.value.x = layout.value[indexDropIdEl.value].x;
			dragItem.value.y = layout.value[indexDropIdEl.value].y;
		} else {
			gridLayoutRef.value.dragEvent(
				'dragend',
				DROP_ID,
				newPos.x,
				newPos.y,
				dragItem.value.h,
				dragItem.value.w,
			);
			deleteDropEl();
		}
	}
}

function handlerDragEnd() {
	gridState.isAddWidget = false;
	const parentRect = wrapperRef.value?.getBoundingClientRect();

	if (!parentRect || !gridLayoutRef.value) {
		deleteDropEl();
		return;
	}

	const mouseInGrid =
		mouseAt.x > parentRect.left &&
		mouseAt.x < parentRect.right &&
		mouseAt.y > parentRect.top &&
		mouseAt.y < parentRect.bottom;

	if (mouseInGrid) {
		const placeholder = dropEl.value;

		if (!placeholder) {
			deleteDropEl();
			return;
		}

		const finalX = Math.max(0, Math.min(placeholder.x, columnsNum.value - dragItem.value.w));
		const finalY = Math.max(0, Math.min(placeholder.y, rowsNum.value - dragItem.value.h + 1));

		deleteDropEl();

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

		emit(
			'add-widget',
			dnDProvider.newDashboard.value.widgetType,
			position,
			mapToWidgetState(
				layout.value
					.filter(item => item.i !== newItemId && !checkIsFake(item.i)),
			),
		);
	} else {
		deleteDropEl();
	}
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
			:margin="[0, 0]"
			use-css-transforms
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
				:drop-id="DROP_ID"
				@change-dnd-state="onChangeDndState"
				@change-resize-state="onChangeResizeState"
				@set-resizable-widget-id="setResizableWidgetId"
				@set-dnd-widget-id="setDndWidgetId"
				@moved="updateLayout"
				@resized="updateLayout"
			>
				<template #state-calm>
					<current-dashboard
						v-if="!checkIsFake(item.i)"
						:dashboard-item="getDashboardItemById(item.i)"
						@delete="deleteDashboards(item.i)"
					/>
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

:deep(.vgl-item--transform) {
	transition: none !important;
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

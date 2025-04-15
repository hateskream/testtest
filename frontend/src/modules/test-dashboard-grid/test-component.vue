<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import type { GridLayout, Layout } from 'grid-layout-plus';
import { throttle, debounce } from '@vexip-ui/utils';

import { responsiveGridLayout } from './composables';
import { GAP } from './constants';

import GridComponents from './grid-components.vue';
import DraggableElement from './draggable-element.vue';
import GridLayoutComponent from './grid-layout-component.vue';

const gridRef = ref<HTMLDivElement | null>(null);

const { rowsNum, columnsNum, rowHeight, columnWidth, rowNumGrid, updateColumnsNumGrid } =
	responsiveGridLayout(gridRef);

const isEditState = ref(false);

const dashboardsInit: IWidget[] = [
	{ x: 0, y: 0, w: 2, h: 2, i: 0, static: false },
	{ x: 2, y: 0, w: 1, h: 1, i: 1, static: false },
	{ x: 3, y: 0, w: 1, h: 1, i: 2, static: false },
	{ x: 2, y: 2, w: 2, h: 1, i: 3, static: false },
	{ x: 4, y: 0, w: 2, h: 4, i: 4, static: false },
	{ x: 6, y: 0, w: 2, h: 2, i: 5, static: false },
	// { x: 0, y: 5, w: 2, h: 2, i: 66, static: false },
	// { x: 2, y: 5, w: 2, h: 2, i: 77, static: false },

	{ x: 6, y: 2, w: 2, h: 2, i: 6, static: false },
	{ x: 0, y: 3, w: 4, h: 2, i: 7, static: false },
];

const layout = ref<Layout>(dashboardsInit);

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout>>();

const rowHeightComputed = computed(() => rowHeight.value - GAP);
const mouseAt = { x: -1, y: -1 };
const dropId = 'drop';
const dragItem = { x: -1, y: -1, w: 2, h: 2, i: '' };

watch([columnsNum, rowsNum], () => {
	layout.value = createGrid(columnsNum.value, layout.value as IWidget[]);
});

function syncMousePosition(event: MouseEvent | TouchEvent) {
	if ('touches' in event) {
		const touch = event.touches[0];
		mouseAt.x = touch.clientX;
		mouseAt.y = touch.clientY;
	} else {
		mouseAt.x = event.clientX;
		mouseAt.y = event.clientY;
	}
}

onMounted(() => {
	document.addEventListener('dragover', syncMousePosition);
	document.addEventListener('mousemove', syncMousePosition);
	document.addEventListener('touchmove', syncMousePosition, { passive: false });
});

onBeforeUnmount(() => {
	document.removeEventListener('dragover', syncMousePosition);
	document.removeEventListener('mousemove', syncMousePosition);
	document.removeEventListener('touchmove', syncMousePosition);
});

interface IWidget {
	x: number;
	y: number;
	w: number;
	h: number;
	i: number;
	static: boolean;
}

function createGrid(colNum: number, initDashboards: IWidget[]): IWidget[] {
	const dashboards: IWidget[] = [...initDashboards];

	function isWidgetOffScreen(widget: IWidget) {
		return widget.x + widget.w > colNum;
	}

	function isDashboardsGridWiderThanScreen() {
		const isOffScreen = dashboards.some(isWidgetOffScreen);
		const isDashboardsWiderThanScreen = dashboards.some(item => item.w > colNum);

		return isOffScreen || isDashboardsWiderThanScreen;
	}

	function findXInLastRow(
		widgetWidth: number,
		currentDashboards: IWidget[],
	): { x: number; y: number } {
		const lastRow = Math.max(...currentDashboards.map(widget => widget.y + widget.h));

		const widgetsInLastRow = currentDashboards.filter(
			widget => widget.y + widget.h > lastRow - 1 && widget.y <= lastRow,
		);

		// eslint-disable-next-line no-plusplus
		for (let x = 0; x <= colNum - widgetWidth; x++) {
			const isPositionFree = !widgetsInLastRow.some(
				widget => x < widget.x + widget.w && x + widgetWidth > widget.x,
			);

			if (isPositionFree) {
				return { x, y: lastRow - 1 };
			}
		}

		return { x: 0, y: lastRow };
	}

	function canPlaceWidgetAt(
		widget: IWidget,
		x: number,
		y: number,
		currentDashboards: IWidget[],
	): boolean {
		return !currentDashboards.some(
			w =>
				w.i !== widget.i &&
				y < w.y + w.h &&
				y + widget.h > w.y &&
				x < w.x + w.w &&
				x + widget.w > w.x,
		);
	}

	function optimizeLayout(currentDashboards: IWidget[]): IWidget[] {
		let updatedDashboards = [...currentDashboards];
		let maxHeight = Math.max(...updatedDashboards.map(widget => widget.y + widget.h));

		const sortedWidgets = [...updatedDashboards].sort((a, b) => b.y + b.h - (a.y + a.h));

		for (const widget of sortedWidgets) {
			const currentHeight = widget.y + widget.h;
			if (currentHeight < maxHeight) {
				// eslint-disable-next-line no-continue
				continue;
			}

			// eslint-disable-next-line no-plusplus
			for (let y = 0; y < widget.y; y++) {
				// eslint-disable-next-line no-plusplus
				for (let x = 0; x <= colNum - widget.w; x++) {
					if (canPlaceWidgetAt(widget, x, y, updatedDashboards)) {
						const widgetIndex = updatedDashboards.findIndex(
							item => item.i === widget.i,
						);

						updatedDashboards = updatedDashboards.map((item, index) =>
							index === widgetIndex ? { ...item, x, y } : item,
						);

						maxHeight = Math.max(...updatedDashboards.map(w => w.y + w.h));
						break;
					}
				}
			}
		}

		const newMaxHeight = Math.max(...updatedDashboards.map(widget => widget.y + widget.h));

		if (newMaxHeight < maxHeight) {
			return optimizeLayout(updatedDashboards);
		}

		return updatedDashboards;
	}

	function adjustDashboards() {
		let updatedDashboards = [...dashboards];

		while (isDashboardsGridWiderThanScreen()) {
			const widget = updatedDashboards.find(isWidgetOffScreen);

			if (!widget) {
				break;
			}

			const widgetIndex = updatedDashboards.findIndex(item => item.i === widget.i);
			const { x, y } = findXInLastRow(widget.w, updatedDashboards);

			updatedDashboards = updatedDashboards.map((item, index) =>
				index === widgetIndex ? { ...item, x, y } : item,
			);
		}

		return optimizeLayout(updatedDashboards);
	}

	return adjustDashboards();
}

function setWrapper(wrapper: HTMLDivElement) {
	wrapperRef.value = wrapper;
}

function updateIsShowGridState(value: boolean) {
	isEditState.value = value;
}

function setGridLayoutRef(gridLayout: InstanceType<typeof GridLayout>) {
	gridLayoutRef.value = gridLayout;
}

const drag = throttle(() => {
	isEditState.value = true;

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
			static: false,
		});
	}

	const index = layout.value.findIndex(item => item.i === dropId);

	if (index !== -1) {
		const item = gridLayoutRef.value.getItem(dropId);

		if (!item) {
			return;
		}

		try {
			item.wrapper.style.display = 'none';
		} catch (e) {
			console.error(e);
		}

		const offsetX = (dragItem.w * (columnWidth.value - GAP)) / 2;
		const offsetY = (dragItem.h * rowHeightComputed.value) / 2;
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
			dragItem.i = String(index);
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
});

const dragEnd = debounce(() => {
	isEditState.value = false;

	const parentRect = wrapperRef.value?.getBoundingClientRect();

	if (!parentRect || !gridLayoutRef.value) {
		layout.value = layout.value.filter(item => item.i !== dropId);
		isEditState.value = false;
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

		const item = gridLayoutRef.value.getItem(dropId);

		try {
			if (item) {
				item.wrapper.style.display = '';
			}
		} catch (e) {
			console.error('Error restoring placeholder display:', e);
		} finally {
			isEditState.value = false;
		}

		const finalX = Math.max(0, Math.min(placeholder.x, columnsNum.value - dragItem.w));
		const finalY = Math.max(0, Math.min(placeholder.y, rowsNum.value - dragItem.h));

		layout.value = layout.value.filter(el => el.i !== dropId);

		const newItemId = String(Date.now());
		layout.value.push({
			x: finalX,
			y: finalY,
			w: dragItem.w,
			h: dragItem.h,
			i: newItemId,
			static: false,
		});

		gridLayoutRef.value.dragEvent('dragend', newItemId, finalX, finalY, dragItem.h, dragItem.w);
	} else {
		layout.value = layout.value.filter(item => item.i !== dropId);
	}
});
</script>

<template>
	<div :class="classes.testWrapper">
		<draggable-element
			@drag="drag"
			@drag-end="dragEnd"
		/>
		<div
			ref="gridRef"
			:class="classes.root"
		>
			<div
				v-show="isEditState"
				:class="classes.grid"
			>
				<grid-components
					:col-num="columnsNum"
					:item-height="rowHeight"
					:item-width="columnWidth"
					:row-num="rowNumGrid"
				/>
			</div>
			<div :class="classes.content">
				<grid-layout-component
					v-model="layout"
					:is-dnd="isEditState"
					:col-num="columnsNum"
					:row-height="rowHeightComputed"
					:col-width="columnWidth"
					:row-num="rowsNum"
					:gap="GAP"
					@update-is-show-grid-state="updateIsShowGridState"
					@set-wrapper="setWrapper"
					@set-grid-layout-ref="setGridLayoutRef"
				/>
			</div>
		</div>
	</div>
</template>

<style module="classes">
.testWrapper {
	position: relative;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;

	/* width: 100%; */
	min-height: 100%;
}

.droppable {
	margin-bottom: 20px;
}

.root {
	position: relative;
	display: flex;
	flex-grow: 1;
	justify-content: center;
	align-items: center;
	width: 100%;

	/* min-height: 100%; */

	/* overflow: hidden; */
}

.content {
	position: relative;
	width: 100%;
}

.grid {
	position: absolute;

	/* z-index: -1; */
	width: 100%;
	height: 100%;
}
</style>

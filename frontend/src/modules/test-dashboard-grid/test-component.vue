<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import type { GridLayout, Layout } from 'grid-layout-plus';
import { throttle, debounce } from '@vexip-ui/utils';

import { responsiveGridLayout } from './composables';

import GridComponents from './grid-components.vue';
import DraggableElement from './draggable-element.vue';
import GridLayoutComponent from './grid-layout-component.vue';

const gridRef = ref<HTMLDivElement | null>(null);

const { rowsNum, columnsNum, rowHeight, columnWidth, rowNumGrid, updateColumnsNumGrid } =
	responsiveGridLayout(gridRef);

const isEditState = ref(true);

const dashboardsInit: IWidget[] = [
	{ x: 0, y: 0, w: 2, h: 2, i: 0, prevW: 2 },
	{ x: 2, y: 0, w: 1, h: 1, i: 1, prevW: 1 },
	{ x: 3, y: 0, w: 1, h: 1, i: 2, prevW: 1 },
	{ x: 2, y: 2, w: 2, h: 1, i: 3, prevW: 2 },
	{ x: 4, y: 0, w: 2, h: 4, i: 4, prevW: 2 },
	{ x: 6, y: 0, w: 2, h: 2, i: 5, prevW: 2 },
	// { x: 0, y: 5, w: 2, h: 2, i: 66 },
	// { x: 2, y: 5, w: 2, h: 2, i: 77 },

	{ x: 6, y: 2, w: 2, h: 2, i: 6, prevW: 2 },
	{ x: 0, y: 3, w: 4, h: 2, i: 7, prevW: 4 },
];

// const dashboardsInit: IWidget[] = [{ x: 0, y: 0, w: 10, h: 2, i: 0 }];

const layout = ref<Layout>(dashboardsInit);

const wrapperRef = ref<HTMLDivElement | null>(null);
const gridLayoutRef = ref<InstanceType<typeof GridLayout>>();

const mouseAt = { x: -1, y: -1 };
const dropId = 'drop';
const dragItem = { x: -1, y: -1, w: 2, h: 2, i: '' };

watch([columnsNum, rowsNum], () => {
	const newLayout = createGrid(columnsNum.value, layout.value as IWidget[]);
	layout.value = newLayout;
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
	prevW: number;
}

interface ISavedLayout {
	columnNum: number;
	layout: IWidget[];
}

function saveLayout(columnNum: number, newLayout: IWidget[]) {
	// Get existing layouts from localStorage
	let savedLayouts: ISavedLayout[] = [];
	const storedLayouts = localStorage.getItem('layouts');

	if (storedLayouts) {
		savedLayouts = JSON.parse(storedLayouts) as ISavedLayout[];
	}

	// Check if layout for this columnNum exists
	const existingLayoutIndex = savedLayouts.findIndex(el => el.columnNum === columnNum);

	const newSavedLayout: ISavedLayout = {
		columnNum,
		layout: newLayout,
	};

	if (existingLayoutIndex !== -1) {
		// Update existing layout
		savedLayouts[existingLayoutIndex] = newSavedLayout;
	} else {
		// Add new layout
		savedLayouts.push(newSavedLayout);
	}

	// Save updated layouts array
	localStorage.setItem('layouts', JSON.stringify(savedLayouts));
}

function getLayout(columnNum: number): ISavedLayout | null {
	const storedLayouts = localStorage.getItem('layouts');

	if (!storedLayouts) {
		return null;
	}

	const savedLayouts = JSON.parse(storedLayouts) as ISavedLayout[];

	// Find layout matching columnNum
	const matchingLayout = savedLayouts.find(el => el.columnNum === columnNum);

	return matchingLayout || null;
}

function createGrid(colNum: number, initDashboards: IWidget[]): IWidget[] {
	const test = getLayout(colNum);

	if (test) {
		return test.layout;
	}

	const dashboards = [...initDashboards];

	const isOffScreen = (widget: IWidget) => widget.x + widget.w > colNum;
	const isWiderThanScreen = (widget: IWidget) => widget.w > colNum;
	const isGridTooWide = (currentDashboards: IWidget[]) =>
		currentDashboards.some(w => isOffScreen(w) || isWiderThanScreen(w));

	const getLastRowInfo = (currentDashboards: IWidget[], widgetWidth: number) => {
		const lastRow = Math.max(0, ...currentDashboards.map(w => w.y + w.h));
		const lastRowWidgets = currentDashboards.filter(
			w => w.y + w.h > lastRow - 1 && w.y <= lastRow,
		);

		// eslint-disable-next-line no-plusplus
		for (let x = 0; x <= colNum - widgetWidth; x++) {
			if (!lastRowWidgets.some(w => x < w.x + w.w && x + widgetWidth > w.x)) {
				return { x, y: lastRow - 1 };
			}
		}
		return { x: 0, y: lastRow };
	};

	const canPlaceWidget = (widget: IWidget, x: number, y: number, currentDashboards: IWidget[]) =>
		!currentDashboards.some(
			w =>
				w.i !== widget.i &&
				y < w.y + w.h &&
				y + widget.h > w.y &&
				x < w.x + w.w &&
				x + widget.w > w.x,
		);

	const optimizeLayoutHeight = (currentDashboards: IWidget[]): IWidget[] => {
		let updatedDashboards = [...currentDashboards];
		const prevHeight = Math.max(0, ...updatedDashboards.map(w => w.y + w.h));

		const sortedWidgets = [...updatedDashboards].sort((a, b) => b.y + b.h - (a.y + a.h));

		for (const widget of sortedWidgets) {
			// eslint-disable-next-line no-plusplus
			for (let y = 0; y < widget.y; y++) {
				// eslint-disable-next-line no-plusplus
				for (let x = 0; x <= colNum - widget.w; x++) {
					if (canPlaceWidget(widget, x, y, updatedDashboards)) {
						updatedDashboards = updatedDashboards.map(w =>
							w.i === widget.i ? { ...w, x, y } : w,
						);
						break;
					}
				}
			}
		}

		const newHeight = Math.max(0, ...updatedDashboards.map(w => w.y + w.h));
		return newHeight < prevHeight ? optimizeLayoutHeight(updatedDashboards) : updatedDashboards;
	};

	function setPrevWidth(currentDashboards: IWidget[]) {
		return currentDashboards.map(w => ({ ...w, w: w.prevW, prevW: w.w }));
	}

	const adjustWidgetWidth = (currentDashboards: IWidget[]): IWidget[] =>
		currentDashboards.map(widget =>
			widget.w > colNum ? { ...widget, w: colNum, prevW: widget.w } : widget,
		);

	function calculateGridWidth(widgets: IWidget[]): number {
		const rowMax: { [key: number]: number } = {};

		for (const widget of widgets) {
			const { x, y, w } = widget;

			if (!(y in rowMax)) {
				rowMax[y] = 0;
			}

			rowMax[y] = Math.max(rowMax[y], x + w);
		}

		let maxWidth = 0;
		for (const max of Object.values(rowMax)) {
			maxWidth = Math.max(maxWidth, max);
		}

		return maxWidth;
	}

	function getItemsByColumns(
		widgets: IWidget[],
		gridWidth: number,
	): { index: number; itemIds: number[] }[] {
		const result: { index: number; itemIds: number[] }[] = [];

		// eslint-disable-next-line no-plusplus
		for (let colIndex = 0; colIndex < gridWidth; colIndex++) {
			const itemIds: number[] = [];

			for (const widget of widgets) {
				const { x, w, i } = widget;

				const itemLeft = x;
				const itemRight = x + w;

				const colLeft = colIndex;
				const colRight = colIndex + 1;

				if (itemLeft < colRight && itemRight > colLeft) {
					itemIds.push(i);
				}
			}

			result.push({ index: colIndex, itemIds });
		}

		return result;
	}

	function optimizeLayoutWidth(widgets: IWidget[]) {
		const gridWidth = calculateGridWidth(widgets);

		const delta = gridWidth - colNum;

		if (delta === 0) {
			return;
		}

		const itemsByColumns = getItemsByColumns(widgets, gridWidth);

		/*

		1 2 3 - 3

		4

		*/

		console.log('colNum', colNum);
		console.log('gridWidth', gridWidth);
		console.log('delta', delta);
		console.log('itemsByColumns', itemsByColumns);
	}

	const adjustDashboards = (): IWidget[] => {
		let updatedDashboards = setPrevWidth([...dashboards]);

		optimizeLayoutWidth(updatedDashboards);

		while (isGridTooWide(updatedDashboards)) {
			const widget = updatedDashboards.find(isOffScreen);
			if (!widget) {
				break;
			}

			updatedDashboards = adjustWidgetWidth(updatedDashboards);
			const { x, y } = getLastRowInfo(updatedDashboards, widget.w);
			updatedDashboards = updatedDashboards.map(w => (w.i === widget.i ? { ...w, x, y } : w));
		}

		return optimizeLayoutHeight(updatedDashboards);
	};

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

		const offsetX = (dragItem.w * columnWidth.value) / 2;
		const offsetY = (dragItem.h * rowHeight.value) / 2;
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

function updateLayout(newLayout: Layout) {
	// layout.value = newLayout.map(el => ({
	// 	...el,
	// 	prevW: el.w,
	// }));
}
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
				v-show="true"
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
					:model-value="layout"
					:is-dnd="isEditState"
					:col-num="columnsNum"
					:row-height="rowHeight"
					:col-width="columnWidth"
					:row-num="rowsNum"
					@update:model-value="updateLayout"
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
	min-height: 100%;
}

.droppable {
	margin-bottom: 20px;
}

.root {
	position: relative;
	flex-grow: 1;
	width: 100%;
}

.content {
	position: relative;
	width: 100%;
}

.grid {
	position: absolute;
	width: 100%;
	height: 100%;
}
</style>

import { onMounted, onUnmounted, readonly, ref, type Ref } from 'vue';

import { calculateGrid, calculateRows } from '../utils';

type CallbackType = (width: number, height: number) => void;

export function responsiveGridLayout(grid: Ref<HTMLElement | null>) {
	const rowsNum = ref(0);
	const columnsNum = ref(0);
	const rowHeight = ref(0);
	const columnWidth = ref(0);
	const rowNumGrid = ref(0);

	let disconectObserverFunc: () => void = () => {};

	onMounted(() => {
		startObserve(grid.value, update);
	});

	onUnmounted(disconectObserverFunc);

	function startObserve(element: HTMLElement | null, setterCallback: CallbackType) {
		if (!element) {
			return;
		}

		const disconect = createResizeObserver(element, setterCallback);
		disconectObserverFunc = disconect;
	}

	function createResizeObserver(element: HTMLElement, setterCallback: CallbackType) {
		const observer = new ResizeObserver(() => {
			setterCallback(element.clientWidth, element.clientHeight);
		});

		observer.observe(element);
		return () => observer.disconnect();
	}

	function update(width: number, height: number) {
		const {
			rowHeight: rowHeightCalc,
			columnWidth: columnWidthCalc,
			columns,
			rows,
		} = calculateGrid(width, height);

		columnsNum.value = columns;
		rowsNum.value = rows;
		rowHeight.value = rowHeightCalc;
		columnWidth.value = columnWidthCalc;
		rowNumGrid.value = rows;
	}

	function updateColumnsNumGrid() {
		if (!grid.value) {
			return;
		}

		const { rows } = calculateRows(grid.value.offsetHeight, rowHeight.value);

		rowNumGrid.value = rows;
	}

	return {
		rowsNum: readonly(rowsNum),
		columnsNum: readonly(columnsNum),
		rowNumGrid: readonly(rowNumGrid),
		rowHeight: readonly(rowHeight),
		columnWidth: readonly(columnWidth),
		updateColumnsNumGrid,
	};
}

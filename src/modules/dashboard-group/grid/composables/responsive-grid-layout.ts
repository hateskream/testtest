import { onMounted, onUnmounted, reactive, readonly, ref, watch, type Ref } from 'vue';

import { calculateGrid, calculateRows } from '../utils';

type CallbackType = (width: number, height: number) => void;

export function responsiveGridLayout(grid: Ref<HTMLElement | null>) {
	const rowsNum = ref(0);
	const columnsNum = ref(0);
	const rowHeight = ref(0);
	const columnWidth = ref(0);
	const rowNumGrid = ref(0);

	const gridState = reactive({
		height: 0,
		width: 0,
		mountHeight: 0,
	});

	let disconnectObserverFunc: () => void = () => {};

	watch(
		() => gridState.width,
		width => {
			update(width, gridState.mountHeight);
		},
	);

	watch(
		() => gridState.height,
		height => {
			updateColumnsNumGrid(height);
		},
	);

	onMounted(() => {
		if (!grid.value) {
			return;
		}

		gridState.mountHeight = grid.value.clientHeight;

		const disconnect = createResizeObserver(grid.value, (width, height) => {
			gridState.width = width;
			gridState.height = height;
		});

		disconnectObserverFunc = disconnect;
	});

	onUnmounted(disconnectObserverFunc);

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

	function updateColumnsNumGrid(height: number) {
		const { rows } = calculateRows(height, rowHeight.value);

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

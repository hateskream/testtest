import { onMounted, onUnmounted, reactive, readonly, ref, watch, type ComponentPublicInstance, type Ref } from 'vue';

import { calculateGrid, calculateRows } from '../utils';

type CallbackType = (width: number, height: number) => void;

export function useGridLayout(container: Ref<ComponentPublicInstance | null>) {
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
		if (!container.value?.$el) {
			return;
		}

		gridState.mountHeight = container.value.$el.clientHeight;

		const disconnect = createResizeObserver(container.value.$el, (width, height) => {
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

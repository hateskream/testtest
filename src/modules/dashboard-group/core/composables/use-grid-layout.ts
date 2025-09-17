import { onMounted, reactive, readonly, ref, watch, type ComponentPublicInstance, type Ref } from 'vue';
import { useElementSize } from '@vueuse/core';

import { calculateGrid, calculateRows } from '../utils';

export function useGridLayout(container: Ref<ComponentPublicInstance | null>) {
	const { width, height } = useElementSize(container);

	const rowsNum = ref(0);
	const columnsNum = ref(0);
	const rowHeight = ref(0);
	const columnWidth = ref(0);
	const rowNumGrid = ref(0);

	const gridState = reactive({
		mountHeight: 0,
	});

	watch(
		width,
		w => update(w, gridState.mountHeight),
	);

	watch(
		height,
		updateColumnsNumGrid,
	);

	onMounted(() => {
		if (!container.value?.$el) {
			return;
		}

		gridState.mountHeight = container.value.$el.clientHeight;
	});

	function update(w: number, h: number) {
		const {
			rowHeight: rowHeightCalc,
			columnWidth: columnWidthCalc,
			columns,
			rows,
		} = calculateGrid(w, h);

		columnsNum.value = columns;
		rowsNum.value = rows;
		rowHeight.value = rowHeightCalc;
		columnWidth.value = columnWidthCalc;
		rowNumGrid.value = rows;
	}

	function updateColumnsNumGrid(h: number) {
		const { rows } = calculateRows(h, rowHeight.value);

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

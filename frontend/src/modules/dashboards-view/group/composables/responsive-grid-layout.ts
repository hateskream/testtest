import { onMounted, onUnmounted, readonly, ref, type Ref } from 'vue';
import { throttle } from '@vexip-ui/utils';

import { calculateGrid, calculateRows } from '../utils';

export function responsiveGridLayout(grid: Ref<HTMLElement | null>) {
	const rowsNum = ref(0);
	const columnsNum = ref(0);
	const rowHeight = ref(0);
	const columnWidth = ref(0);
	const rowNumGrid = ref(0);

	const debaunceUpdate = throttle(update, 300);

	onMounted(() => {
		update();
		window.addEventListener('resize', debaunceUpdate);
	});

	onUnmounted(() => {
		window.removeEventListener('resize', debaunceUpdate);
	});

	function update() {
		if (!grid.value) {
			return;
		}

		const {
			rowHeight: rowHeightCalc,
			columnWidth: columnWidthCalc,
			columns,
			rows,
		} = calculateGrid(grid.value.offsetWidth, grid.value.offsetHeight);

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

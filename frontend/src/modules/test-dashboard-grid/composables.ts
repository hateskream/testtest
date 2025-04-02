import { onMounted, onUnmounted, readonly, ref, type Ref } from 'vue';

import { calculateGrid } from './utils';

export function responsiveGridLayout(grid: Ref<HTMLElement | null>) {
	const rowsNum = ref(0);
	const columnsNum = ref(0);
	const rowHeight = ref(0);

	onMounted(() => {
		update();
		window.addEventListener('resize', update);
	});

	onUnmounted(() => {
		window.removeEventListener('resize', update);
	});

	function update() {
		if (!grid.value) {
			return;
		}

		const {
			rowHeight: rowHeightCalc,
			columns,
			rows,
		} = calculateGrid(grid.value.offsetWidth, grid.value.offsetHeight);

		columnsNum.value = columns;
		rowsNum.value = rows;
		rowHeight.value = rowHeightCalc;
	}

	return {
		rowsNum: readonly(rowsNum),
		columnsNum: readonly(columnsNum),
		rowHeight: readonly(rowHeight),
	};
}

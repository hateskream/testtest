import { ref, watch, type Ref } from 'vue';

import { createGrid } from '../utils';
import type { IPosition, IPositionWithId } from '../model';

export function useRebuildingGrid(
	columnsNum: Ref<number>,
	rowsNum: Ref<number>,
	rawDashboard: Ref<IPositionWithId[]>,
) {
	const layout = ref<IPositionWithId[]>([]);

	watch(
		rawDashboard,
		newsDashboard => {
			const newLayout = createGrid(columnsNum.value, newsDashboard);
			layout.value = newLayout;
		},
		{
			immediate: true,
		},
	);

	watch([columnsNum, rowsNum], () => {
		const newLayout = createGrid(columnsNum.value, layout.value);
		layout.value = newLayout;
	});

	return {
		layout,
	};
}

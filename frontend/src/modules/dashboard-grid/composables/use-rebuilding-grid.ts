import { ref, watch, type Ref } from 'vue';

import { createGrid } from '../utils';
import type { IPosition } from '../model';

export function useRebuildingGrid(
	columnsNum: Ref<number>,
	rowsNum: Ref<number>,
	rawDashboard: Ref<IPosition[]>,
) {
	const layout = ref<IPosition[]>([]);

	watch(
		rawDashboard,
		newsDashboard => {
			layout.value = newsDashboard;
		},
		{
			immediate: true,
		},
	);

	watch([columnsNum, rowsNum], () => {
		const newLayout = createGrid(columnsNum.value, rawDashboard.value);
		layout.value = newLayout;
	});

	return {
		layout,
	};
}

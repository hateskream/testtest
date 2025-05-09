import { ref, watch, type Ref } from 'vue';

import { createGrid } from '../utils';
import type { IPositionWithId } from '@/modules/dashboard-group';

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
		const newLayout = createGrid(columnsNum.value, rawDashboard.value);
		layout.value = newLayout;
	});

	return {
		layout,
	};
}

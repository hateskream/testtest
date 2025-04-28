import type { Layout } from 'grid-layout-plus';
import { ref, watch, type Ref } from 'vue';

import { createGrid } from '../utils';
import type { IPosition } from '../model';

export function useRebuildingGrid(
	columnsNum: Ref<number>,
	rowsNum: Ref<number>,
	rawDashboard: Ref<IPosition[]>,
) {
	const layout = ref<Layout>([]);

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
		const newLayout = createGrid(columnsNum.value, layout.value as IPosition[]);
		layout.value = newLayout;
	});

	return {
		layout,
	};
}

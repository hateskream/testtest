import { computed, ref, watch, type Ref } from 'vue';

import { createGrid } from '../utils';
import type { IPosition } from '../model';
import type { IWidget } from '../../core';

export function useRebuildingGrid(
	columnsNum: Ref<number>,
	rowsNum: Ref<number>,
	rawWidgets: Ref<IWidget[]>,
) {

	const layout = ref<IPosition[]>([]);

	const isEmpty = computed(() => rawWidgets.value.length === 0);

	const rawDashboards = computed((): IPosition[] =>
		isEmpty.value ?
			generateEmptyGrid(columnsNum.value, rowsNum.value) :
			rawWidgets.value.map(el => ({ ...el.position, i: el.id })),
	);

	watch(
		rawDashboards,
		newsDashboards => {
			layout.value = newsDashboards;
		},
		{
			immediate: true,
		},
	);

	watch([columnsNum, rowsNum], () => {
		const newLayout = createGrid(columnsNum.value, rawWidgets.value.map(el => ({ ...el.position, i: el.id })));
		layout.value = newLayout;
	});

	function generateEmptyGrid(cn: number, rn: number): IPosition[] {
		return Array.from({ length: rn * cn }, (_, index) => ({
			x: index % cn,
			y: Math.floor(index / cn),
			w: 1,
			h: 1,
			i: String(index + Date.now()),
		}));
	}

	return {
		layout,
		isEmpty,
	};
}

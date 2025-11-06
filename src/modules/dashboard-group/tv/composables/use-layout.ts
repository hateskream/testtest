import { computed, ref, watch, type Ref } from 'vue';

import { createGrid, mapToLayoutItem, type ILayoutItem, type IWidget } from '../model';

export function useLayout(
	columnsNum: Ref<number>,
	rowsNum: Ref<number>,
	rawWidgets: Ref<IWidget[]>,
) {
	const FAKE_ID_PREFIX = 'fake-id';
	const DROP_ID = 'drop-id';

	const layout = ref<ILayoutItem[]>([]);

	const isEmpty = computed(() => rawWidgets.value.length === 0);
	const hasDropId = computed(() => !!layout.value.find(item => item.i === DROP_ID));
	const indexDropIdEl = computed(() => layout.value.findIndex(item => item.i === DROP_ID));
	const dropEl = computed(() => layout.value.find(item => item.i === DROP_ID));

	watch(
		[columnsNum, rowsNum, rawWidgets],
		() => {
			rebuildLayout();
		},
		{
			deep: true,
			immediate: true,
		},
	);

	function generateEmptyGrid(columns: number, rows: number): ILayoutItem[] {
		const totalCells = columns * rows;

		return Array.from({ length: totalCells }, (_, index) => ({
			x: index % columns,
			y: Math.floor(index / columns),
			w: 1,
			h: 1,
			i: `${FAKE_ID_PREFIX}${index}${Date.now()}`,
		}));
	}

	function checkIsFake(id: string): boolean {
		if (!id) {
			return false;
		}

		return id.startsWith(FAKE_ID_PREFIX) || id === DROP_ID;
	}

	function rebuildLayout() {
		if (isEmpty.value) {
			layout.value = generateEmptyGrid(columnsNum.value, rowsNum.value);
		} else {
			const positions = mapToLayoutItem(rawWidgets.value);

			layout.value = createGrid(columnsNum.value, positions);
		}
	}

	function addDropEl(x: number, y: number, w: number, h : number) {
		layout.value.push({
			x,
			y,
			w,
			h,
			i: DROP_ID,
		});
	}

	function deleteDropEl() {
		layout.value = layout.value.filter(item => item.i !== DROP_ID);
	}

	return {
		layout,
		isEmpty,
		hasDropId,
		DROP_ID,
		indexDropIdEl,
		dropEl,
		checkIsFake,
		addDropEl,
		deleteDropEl,
	};
}

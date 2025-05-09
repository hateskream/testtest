import type { IPosition } from '../model';

interface ISavedLayout {
	columnNum: number;
	layout: IPosition[];
}

export function saveLayout(columnNum: number, newLayout: IPosition[]) {
	let savedLayouts: ISavedLayout[] = [];
	const storedLayouts = localStorage.getItem('layouts');

	if (storedLayouts) {
		savedLayouts = JSON.parse(storedLayouts) as ISavedLayout[];
	}

	const existingLayoutIndex = savedLayouts.findIndex(el => el.columnNum === columnNum);

	const newSavedLayout: ISavedLayout = {
		columnNum,
		layout: newLayout,
	};

	if (existingLayoutIndex !== -1) {
		savedLayouts[existingLayoutIndex] = newSavedLayout;
	} else {
		savedLayouts.push(newSavedLayout);
	}

	localStorage.setItem('layouts', JSON.stringify(savedLayouts));
}

export function getLayout(columnNum: number): ISavedLayout | null {
	const storedLayouts = localStorage.getItem('layouts');

	if (!storedLayouts) {
		return null;
	}

	const savedLayouts = JSON.parse(storedLayouts) as ISavedLayout[];

	const matchingLayout = savedLayouts.find(el => el.columnNum === columnNum);

	return matchingLayout || null;
}

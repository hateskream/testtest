import { type Component } from 'vue';


import TableCellSymbol from './table-cell-symbol.vue';
import StringCellComponent from './cell-string-component.vue';
import CellEmptyStateComponent from './cell-empty-state-component.vue';
import CellNumberComponent from './cell-number-component.vue';
import CellPercentComponent from './cell-percent-component.vue';
import CellPlate from './cell-plate.vue';
import TableCellChart from './table-cell-chart.vue';
import TableCellRange from './table-cell-range.vue';
import TableCellScore from './table-cell-score.vue';
import TableCellIsOpen from './table-cell-is-open.vue';

export enum CellType {
	SYMBOL = 'symbol',
	NUMBER = 'number',
	PERCENT = 'percent',
	CHART = 'chart',
	RANGE = 'range',
	TEXT = 'text',
	IMAGE_STRING = 'image-string',
	PLATE = 'plate',
	EMPTY = 'empty',
	SCORE = 'score',
	IS_OPEN = 'open',
}


const components: Record<CellType, Component> = {
	// FIXME: Why there is so many items for symbol?
	[CellType.SYMBOL]: TableCellSymbol,
	[CellType.IMAGE_STRING]: TableCellSymbol,
	[CellType.NUMBER]: CellNumberComponent,
	[CellType.PERCENT]: CellPercentComponent,
	// TODO: add range component and add it here instead CellEmptyStateComponent
	[CellType.RANGE]: TableCellRange,
	[CellType.TEXT]: StringCellComponent,
	[CellType.PLATE]: CellPlate,
	// TODO: add chart component and add it here in
	[CellType.CHART]: TableCellChart,
	[CellType.EMPTY]: CellEmptyStateComponent,
	[CellType.SCORE]: TableCellScore,
	[CellType.IS_OPEN]: TableCellIsOpen,
};

export function getComponentByType(key: CellType | undefined | null): Component {
	return components[key as CellType] || CellEmptyStateComponent;
}

import { type Component } from 'vue';


import TableCellSymbol from './table-cell-symbol.vue';
import StringCellComponent from './cell-string-component.vue';
import CellEmptyStateComponent from './cell-empty-state-component.vue';
import CellImageComponent from './cell-image-component.vue';
import CellNumberComponent from './cell-number-component.vue';
import CellPercentComponent from './cell-percent-component.vue';
import CellDateComponent from './cell-date-component.vue';
import CellPlate from './cell-plate.vue';

export enum CellType {
	SYMBOL = 'symbol',
	// SYMBOL = 'image-string',
	NUMBER = 'number',
	PERCENT = 'percent',
	CHART = 'chart',
	RANGE = 'range',
	TEXT = 'text',
	IMAGE = 'image',
	DATE = 'date',
	IMAGE_STRING = 'image-string',
	PLATE = 'plate',
}

const components: Record<CellType, Component> = {
	// [CellType.SYMBOL]: CellImageComponent,
	[CellType.SYMBOL]: TableCellSymbol,
	[CellType.NUMBER]: CellNumberComponent,
	[CellType.PERCENT]: CellPercentComponent,
	[CellType.CHART]: StringCellComponent,
	[CellType.RANGE]: StringCellComponent,
	[CellType.TEXT]: StringCellComponent,
	[CellType.IMAGE]: CellImageComponent,
	[CellType.DATE]: CellDateComponent,
	[CellType.IMAGE_STRING]: TableCellSymbol,
	[CellType.PLATE]: CellPlate,
};

export function getComponentByType(key: CellType | undefined | null): Component {
	return components[key as CellType] || CellEmptyStateComponent;
}

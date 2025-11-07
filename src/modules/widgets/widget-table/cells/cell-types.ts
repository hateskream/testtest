import { type Component } from 'vue';


import TableCellSymbolComponent from './table-cell-symbol-component.vue';
import TableCellStringComponent from './table-cell-string-component.vue';
import TableCellEmptyStateComponent from './table-cell-empty-state-component.vue';
import TableCellNumberComponent from './table-cell-number-component.vue';
import TableCellPercentComponent from './table-cell-percent-component.vue';
import TableCellPlateComponent from './table-cell-plate-component.vue';
import TableCellChartComponent from './table-cell-chart-component.vue';
import TableCellRangeComponent from './table-cell-range-component.vue';
import TableCellScoreComponent from './table-cell-score-component.vue';
import TableCellIsOpenComponent from './table-cell-is-open-component.vue';
import TableCellCheckComponent from './table-cell-check-component.vue';
import TableCellScheduleComponent from './table-cell-schedule-component.vue';

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
	CHECK = 'check',
	SCHEDULE = 'schedule',
}


const components: Record<CellType, Component> = {
	[CellType.SYMBOL]: TableCellSymbolComponent,
	[CellType.IMAGE_STRING]: TableCellSymbolComponent,
	[CellType.NUMBER]: TableCellNumberComponent,
	[CellType.PERCENT]: TableCellPercentComponent,
	[CellType.RANGE]: TableCellRangeComponent,
	[CellType.TEXT]: TableCellStringComponent,
	[CellType.PLATE]: TableCellPlateComponent,
	[CellType.CHART]: TableCellChartComponent,
	[CellType.EMPTY]: TableCellEmptyStateComponent,
	[CellType.SCORE]: TableCellScoreComponent,
	[CellType.IS_OPEN]: TableCellIsOpenComponent,
	[CellType.CHECK]: TableCellCheckComponent,
	[CellType.SCHEDULE]: TableCellScheduleComponent,
};

export function getComponentByType(key: CellType | undefined | null): Component {
	return components[key as CellType] || TableCellEmptyStateComponent;
}

import { type ISize, WidgetType } from '../../widget';

export interface IPresetPosition {
	x: number;
	y: number;
	size: ISize;
}

export type PresetPositions = Record<ColNumType, IPresetPosition>;

/*
	кол-во колонок от 2 до 20 (3445px)
*/
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colNumbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] as const;
type ColNumType = typeof colNumbers[number];

export type PresetLayout = Partial<Record<WidgetType, PresetPositions>>;



import { type ISize, WidgetType } from '../../widget';

export interface IPresetPosition {
	x: number;
	y: number;
	size: ISize;
}

export interface IWidgetInstancePreset {
	id: string;
	type: WidgetType;
	position: IPresetPosition;
	defaultStateType?: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const colNumbers = [2, 4, 6, 8, 10, 12, 14, 16, 20] as const;
type ColNumType = typeof colNumbers[number];

export type PresetLayout = Record<ColNumType, IWidgetInstancePreset[]>;



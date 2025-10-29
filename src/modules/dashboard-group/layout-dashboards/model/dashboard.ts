import { v4 as uuidv4 } from 'uuid';

import { createSectionFromPreset, type ISection, type ISectionPreset } from './section';
import { WidgetType } from '../../core';

export interface IDashboard {
	id: string;
	name: string;
	sections: ISection[];
}

export type PresetName = 'Crypto' | 'Stock' | 'Forex';

const presets: Record<PresetName, ISectionPreset[]> = {
	Crypto: [
		{
			name: 'Cryp2to',
			width: 300,
			widgets: [
				{
					defaultState: 'none',
					height: 150,
					widgetType:  WidgetType.FearGreed,
				},
			],
		},
		{
			name: 'Crypto1',
			width: 300,
			widgets: [
				{
					defaultState: 'none',
					height: 150,
					widgetType:  WidgetType.FearGreed,
				},
			],
		},
		// {
		// 	name: 'Crypto3',
		// 	width: 300,
		// 	widgets: [
		// 		{
		// 			defaultState: 'none',
		// 			height: 150,
		// 			widgetType:  WidgetType.FearGreed,
		// 		},
		// 	],
		// },
		// {
		// 	name: 'Crypto4',
		// 	width: 300,
		// 	widgets: [
		// 		{
		// 			defaultState: 'none',
		// 			height: 150,
		// 			widgetType:  WidgetType.FearGreed,
		// 		},
		// 	],
		// },
		// {
		// 	name: 'Crypto5',
		// 	width: 300,
		// 	widgets: [
		// 		{
		// 			defaultState: 'none',
		// 			height: 150,
		// 			widgetType:  WidgetType.FearGreed,
		// 		},
		// 	],
		// },
		// {
		// 	name: 'Crypto6',
		// 	width: 300,
		// 	widgets: [
		// 		{
		// 			defaultState: 'none',
		// 			height: 150,
		// 			widgetType:  WidgetType.FearGreed,
		// 		},
		// 	],
		// },
		// {
		// 	name: 'Crypto7',
		// 	width: 300,
		// 	widgets: [
		// 		{
		// 			defaultState: 'none',
		// 			height: 150,
		// 			widgetType:  WidgetType.FearGreed,
		// 		},
		// 	],
		// },
	],
	Stock: [],
	Forex: [],
};

export function createDashboardFromPreset(presetName: PresetName): IDashboard {
	return {
		id: uuidv4(),
		name: presetName,
		sections: presets[presetName].map(createSectionFromPreset),
	};
}

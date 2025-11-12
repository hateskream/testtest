import { v4 as uuidv4 } from 'uuid';

import { createSectionFromPreset, type ISection, type ISectionPreset } from './section';
import { WidgetType } from '../../core';

export interface IDashboard {
	id: string;
	name: string;
	sections: ISection[];
}

export type PresetName = 'Crypto' | 'Stock' | 'Main';

const presets: Record<PresetName, ISectionPreset[]> = {
	Crypto: [],
	Stock: [],
	Main: [
		{
			name: 'US Economy',
			width: 560,
			widgets: [
				{
					defaultState: 'stock',
					height: Infinity,
					widgetType:  WidgetType.Calendar,
					defaultDisplayVariant: 'default',
				},
			],
		},
		{
			name: 'Market Momentum',
			width: 560,
			widgets: [
				{
					defaultState: 'stock',
					height: 465,
					widgetType:  WidgetType.ChartPrice,
					defaultDisplayVariant: 'chart',
				},
				{
					defaultState: 'none',
					height: 406,
					maxCountRow: 7,
					widgetType:  WidgetType.TopIndices,
					defaultDisplayVariant: 'default',
				},
				// {
				// 	defaultState: 'stock',
				// 	height: Infinity,
				// 	widgetType:  WidgetType.Performance,
				// 	defaultDisplayVariant: 'bar',
				// },
			],
		},
		{
			name: 'News & Events',
			width: 360,
			widgets: [
				{
					defaultState: 'stock',
					height: Infinity,
					widgetType:  WidgetType.News,
					defaultDisplayVariant: 'default',
				},
			],
		},
		{
			name: 'Overview',
			width: 360,
			widgets: [
				{
					defaultState: 'crypto',
					height: 226,
					widgetType:  WidgetType.MarketCap,
					defaultDisplayVariant: 'chart',
				},
				{
					defaultState: 'none',
					height: 175,
					widgetType:  WidgetType.BitcoinDominance,
					defaultDisplayVariant: 'tile',
				},
				{
					defaultState: 'USDollar', // сделать стейт
					height: 156,
					widgetType:  WidgetType.ChartPrice,
					defaultDisplayVariant: 'tile',
				},
				{
					defaultState: 'Gold', // сделать стейт
					height: 156,
					widgetType:  WidgetType.ChartPrice,
					defaultDisplayVariant: 'tile',
				},
			],
		},
		{
			name: 'Cross-Market Insight',
			width: 328,
			widgets: [
				{
					defaultState: 'commodity',
					height: 337,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'crypto',
					height: 337,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'stock',
					height: 337,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'forex',
					height: 337,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'eth', // добавить
					height: 337,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'index',
					height: 337,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
			],
		},
		{
			name: 'Gainers',
			width: 360,
			widgets: [
				{
					defaultState: 'stock-gainers', // сделать стейт
					height: Infinity,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
			],
		},
		{
			name: 'Losers',
			width: 360,
			widgets: [
				{
					defaultState: 'stock-gainers', // сделать стейт
					height: Infinity,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
			],
		},
		// {
		// 	name: 'US Economy',
		// 	width: 630,
		// 	widgets: [
		// 		{
		// 			defaultState: 'none', // сделать стейт
		// 			height: Infinity,
		// 			widgetType:  WidgetType.Calendar, // сделать бесконечный скролл ы
		// 			defaultDisplayVariant: 'default',
		// 		},
		// 	],
		// },
	],
};

export function createDashboardFromPreset(presetName: PresetName): IDashboard {
	return {
		id: uuidv4(),
		name: presetName,
		sections: presets[presetName].map(createSectionFromPreset),
	};
}

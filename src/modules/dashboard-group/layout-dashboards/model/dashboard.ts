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
			name: 'Market Momentum',
			width: 560,
			widgets: [
				{
					defaultState: 'stock',
					height: 465,
					widgetType:  WidgetType.ChartPrice,
				},
				{
					defaultState: 'none',
					height: 406,
					maxCountRow: 7,
					widgetType:  WidgetType.TopIndices, // ограничить кол-во колонок
				},
				{
					defaultState: 'stock',
					height: Infinity,
					widgetType:  WidgetType.Performance,
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
				},
				{
					defaultState: 'none',
					height: 175,
					widgetType:  WidgetType.BitcoinDominance,
				},
				{
					defaultState: 'USDollar', // сделать стейт
					height: 156,
					widgetType:  WidgetType.ChartPrice,
				},
				{
					defaultState: 'Gold', // сделать стейт
					height: 156,
					widgetType:  WidgetType.ChartPrice,
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
				},
				{
					defaultState: 'crypto',
					height: 337,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
				},
				{
					defaultState: 'stock',
					height: 337,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
				},
				{
					defaultState: 'forex',
					height: 337,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
				},
				{
					defaultState: 'eth', // добавить
					height: 337,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
				},
				{
					defaultState: 'index',
					height: 337,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
				},
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
				},
			],
		},
		{
			name: 'US Economy',
			width: 630,
			widgets: [
				{
					defaultState: 'none', // сделать стейт
					height: Infinity,
					widgetType:  WidgetType.Calendar, // сделать бесконечный скролл ы
				},
			],
		},
	],
};

export function createDashboardFromPreset(presetName: PresetName): IDashboard {
	return {
		id: uuidv4(),
		name: presetName,
		sections: presets[presetName].map(createSectionFromPreset),
	};
}

import { v4 as uuidv4 } from 'uuid';

import { createSectionFromPreset, type ISection, type ISectionPreset } from './section';
import { WidgetType } from '../../core';
import { isFeatureEnabled } from '@/shared/lib';

export interface IDashboard {
	id: string;
	name: string;
	sections: ISection[];
	isComingSoon?: boolean;
	comingSoonText?: string;
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
					defaultDisplayVariant: 'chart',
				},
				{
					defaultState: 'none',
					height: 308,
					maxCountRow: 6,
					widgetType:  WidgetType.TopIndices,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'stock',
					height: 496,
					widgetType:  WidgetType.Performance,
					defaultDisplayVariant: 'bar',
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
					defaultState: 'USDollar',
					height: 136,
					widgetType:  WidgetType.ChartPrice,
					defaultDisplayVariant: 'tile',
				},
				{
					defaultState: 'Gold',
					height: 136,
					widgetType:  WidgetType.ChartPrice,
					defaultDisplayVariant: 'tile',
				},
				{
					defaultState: 'stock',
					height: 145,
					widgetType:  WidgetType.UsInflation,
					defaultDisplayVariant: 'chart',
				},
				{
					defaultState: 'stock',
					height: 135,
					widgetType:  WidgetType.FederalFunds,
					defaultDisplayVariant: 'chart',
				},
			],
		},
		{
			name: 'Cross-Market Insight',
			width: 328,
			widgets: [
				{
					defaultState: 'commodity',
					height: 354,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'crypto',
					height: 354,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'stock',
					height: 354,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'forex',
					height: 354,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				// {
				// 	defaultState: 'eth', // добавить
				//  height: 354,
				// 	maxCountRow: 4,
				// 	widgetType:  WidgetType.Price,
				// 	defaultDisplayVariant: 'default',
				// },
				{
					defaultState: 'index',
					height: 354,
					maxCountRow: 4,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
			],
		},
		{
			name: 'News & Events',
			width: 360,
			widgets: [
				{
					defaultState: 'stock',
					height: 245,
					widgetType:  WidgetType.NewsSummary,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'stock',
					height: Infinity,
					widgetType:  WidgetType.News,
					defaultDisplayVariant: 'default',
				},
			],
		},
		{
			name: 'Economic Calendar',
			width: 360,
			widgets: [
				{
					defaultState: 'stock',
					height: 240,
					widgetType:  WidgetType.HighImpactHourMap,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'economic',
					height: Infinity,
					widgetType:  WidgetType.Calendar, // сделать бесконечный скролл
					defaultDisplayVariant: 'default',
				},
			],
		},
		{
			name: 'Gainers',
			width: 360,
			widgets: [
				{
					defaultState: 'stock-gainers',
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
					defaultState: 'stock-losers',
					height: Infinity,
					widgetType:  WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
			],
		},
		{
			name: 'US Economy',
			width: 630,
			widgets: [
				{
					defaultState: 'none',
					height: 350,
					widgetType:  WidgetType.ConsumerPriceIndex,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'none',
					height: 350,
					widgetType:  WidgetType.NominalGDP,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'none',
					height: 350,
					widgetType:  WidgetType.RealGDP,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'none',
					height: 190,
					widgetType:  WidgetType.UnemploymentRate,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'none',
					height: 190,
					widgetType:  WidgetType.NonfarmPayrolls,
					defaultDisplayVariant: 'default',
				},
			],
		},
	],
};


const enabledDashboardPresets: Record<PresetName, boolean> = {
	Main: true,
	Crypto: isFeatureEnabled('CRYPTO_DASHBOARD_ENABLED'),
	Stock: isFeatureEnabled('STOCK_DASHBOARD_ENABLED'),
};

function isComingSoonPreset(presetName: PresetName) {
	return !enabledDashboardPresets[presetName];
}

const comingSoonPresets: Record<PresetName, string | undefined> = {
	Crypto: 'Track and analyze crypto market — coming soon.',
	Stock: 'Dive into global stock data — coming soon.',
	Main: undefined,
} as const;

function getComingSoonText(presetName: PresetName): string | undefined {
	return comingSoonPresets[presetName];
}

export function createDashboardFromPreset(presetName: PresetName): IDashboard {
	return {
		id: uuidv4(),
		name: presetName,
		sections: presets[presetName].map(createSectionFromPreset),
		isComingSoon: isComingSoonPreset(presetName),
		comingSoonText: getComingSoonText(presetName),
	};
}

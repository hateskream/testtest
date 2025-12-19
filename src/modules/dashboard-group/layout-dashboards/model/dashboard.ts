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
	Crypto: [
		{
			name: 'Market Momentum',
			width: 560,
			widgets: [
				{
					defaultState: 'crypto',
					height: 418,
					widgetType:  WidgetType.ChartPrice,
					defaultDisplayVariant: 'chart',
				},
				// {
				// 	defaultState: 'none',
				// 	height: 928,
				// 	maxCountRow: 6,
				// 	widgetType:  WidgetType.Market,
				// 	defaultDisplayVariant: 'default',
				// }
			],
		},
		{
			name: 'Overview',
			width: 360,
			widgets: [
				// {
				// 	defaultState: 'none',
				// 	height: 226,
				// 	widgetType:  WidgetType.FearGreed,
				// 	defaultDisplayVariant: 'chart',
				// },
				// {
				// 	defaultState: 'none',
				// 	height: 171,
				// 	widgetType:  WidgetType.EthGas,
				// 	defaultDisplayVariant: 'default',
				// },
				{
					defaultState: 'none',
					height: 290,
					widgetType:  WidgetType.MarketCap,
					defaultDisplayVariant: 'chart',
				},
				{
					defaultState: 'none',
					height: 204,
					widgetType:  WidgetType.BitcoinDominance,
					defaultDisplayVariant: 'default',
				},
				// {
				// 	defaultState: 'none',
				// 	height: 712,
				// 	widgetType:  WidgetType.AltcoinSeason,
				// 	defaultDisplayVariant: 'default',
				// }
			],
		},
		{
			name: 'News',
			width: 360,
			widgets: [
				{
					defaultState: 'stock',
					height: 250,
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
		// {
		// 	name: 'Performance map',
		// 	width: 560,
		// 	widgets: [
		// 		{
		// 			defaultState: 'none',
		// 			height: 560,
		// 			widgetType:  WidgetType.Heatmap,
		// 			defaultDisplayVariant: 'default',
		// 		}
		// 	],
		// },
	],
	Stock: [
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
				// {
				// 	defaultState: 'stock',
				// 	height: 928,
				// 	maxCountRow: 6,
				// 	widgetType:  WidgetType.Market,
				// 	defaultDisplayVariant: 'default',
				// },
			],
		},
		{
			name: 'Overview',
			width: 360,
			widgets: [
				{
					defaultState: 'SPX',
					height: 132,
					widgetType:  WidgetType.ChartPrice,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'NDX',
					height: 132,
					widgetType:  WidgetType.ChartPrice,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'stock',
					height: 496,
					widgetType:  WidgetType.Performance,
					defaultDisplayVariant: 'bar',
				},
				{
					defaultState: 'stock',
					height: 226,
					widgetType:  WidgetType.MarketCap,
					defaultDisplayVariant: 'chart',
				},
				// {
				// 	defaultState: 'stock',
				// 	height: 316,
				// 	widgetType:  WidgetType.Exchange,
				// 	defaultDisplayVariant: 'default',
				// }
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
			name: 'News',
			width: 360,
			widgets: [
				{
					defaultState: 'stock',
					height: 250,
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
		// {
		// 	name: 'Performance map',
		// 	width: 560,
		// 	widgets: [
		// 		{
		// 			defaultState: 'none',
		// 			height: 560,
		// 			widgetType:  WidgetType.Heatmap,
		// 			defaultDisplayVariant: 'default',
		// 		}
		// 	],
		// },
	],
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
					height: 316,
					maxCountRow: 7,
					widgetType:  WidgetType.TopIndices,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'stock',
					maxCountRow: 11,
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
					height: 125,
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
					stateType: 'Commodity',
					height: 354,
					maxCountRow: 4,
					widgetType: WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'crypto',
					stateType: 'Crypto',
					height: 354,
					maxCountRow: 4,
					widgetType: WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'stock',
					stateType: 'Stock',
					height: 354,
					maxCountRow: 4,
					widgetType: WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				{
					defaultState: 'forex',
					stateType: 'Forex',
					height: 354,
					maxCountRow: 4,
					widgetType: WidgetType.Price,
					defaultDisplayVariant: 'default',
				},
				// {
				// 	defaultState: 'eth',
				// 	stateType: 'Eth',
				// 	height: 354,
				// 	maxCountRow: 4,
				// 	widgetType: WidgetType.Price,
				// 	defaultDisplayVariant: 'default',
				// },
				{
					defaultState: 'index',
					stateType: 'Index',
					height: 354,
					maxCountRow: 4,
					widgetType: WidgetType.Price,
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
					height: 250,
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
					stateType: 'Stock',
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
					stateType: 'Stock',
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

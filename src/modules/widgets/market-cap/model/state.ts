import { z } from 'zod';

import { type IDisplaySettings } from './display';
import { MarketCapDateRange, type MarketCapType } from './market-cap';
import { MarketType } from '@/modules/market';

export interface IState {
	selectedTickers: string[];
	selectedMarkets: MarketCapType[];
	dateRange: MarketCapDateRange;
	displaySettings: IDisplaySettings;
}

const displaySettingsSchema = z.object({
	isShowChart: z.boolean(),
	isShowChange: z.boolean(),
});

export const stateSchema = z.object({
	selectedTickers: z.array(z.string()),
	selectedMarkets: z.array(z.enum([MarketType.Crypto, MarketType.Stock])),
	dateRange: z.nativeEnum(MarketCapDateRange),
	displaySettings: displaySettingsSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		selectedTickers: [],
		selectedMarkets: [MarketType.Crypto],
		dateRange: MarketCapDateRange.Month,
		displaySettings: {
			isShowChart: true,
			isShowChange: true,
		},
	};
}

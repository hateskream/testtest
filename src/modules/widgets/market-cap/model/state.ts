import { z } from 'zod';

import { type IDisplaySettings } from './display';
import { type MarketCapType } from './market-cap';
import { MarketType } from '@/modules/market';
import { DateRangePreset, type DateRangeValue, DateRangeValueSchema } from '@/modules/charts/common/model';
import type { WidgetState } from '@/modules/dashboard-group';

export interface IState extends WidgetState {
	selectedTickers: string[];
	selectedMarkets: MarketCapType[];
	dateRange: DateRangeValue;
	displaySettings: IDisplaySettings;
}

const displaySettingsSchema = z.object({
	isShowChart: z.boolean(),
	isShowChange: z.boolean(),
});

export const stateSchema = z.object({
	selectedTickers: z.array(z.string()),
	selectedMarkets: z.array(z.enum([MarketType.Crypto, MarketType.Stock])),
	dateRange: DateRangeValueSchema,
	displaySettings: displaySettingsSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;
export type StateSchemaInputType = z.input<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		selectedTickers: [],
		selectedMarkets: [MarketType.Crypto],
		dateRange: {
			type: 'preset',
			preset: DateRangePreset.Day,
		},
		displaySettings: {
			isShowChart: true,
			isShowChange: true,
		},
	};
}

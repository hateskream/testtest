import { z } from 'zod';

import { type IDisplaySettings } from './display';
import { MarketCapDateRange } from './market-cap';

export interface IState {
	selectedTickers: string[];
	dateRange: MarketCapDateRange;
	displaySettings: IDisplaySettings;
}

const displaySettingsSchema = z.object({
	isShowChart: z.boolean(),
	isShowChange: z.boolean(),
});

export const stateSchema = z.object({
	selectedTickers: z.array(z.string()),
	dateRange: z.nativeEnum(MarketCapDateRange),
	displaySettings: displaySettingsSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		selectedTickers: [],
		dateRange: MarketCapDateRange.All,
		displaySettings: {
			isShowChart: true,
			isShowChange: true,
		},
	};
}

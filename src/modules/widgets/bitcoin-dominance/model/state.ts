import { z } from 'zod';

import { type IDisplaySettings } from './display';
import { DominanceDateRange } from '@/modules/widgets/bitcoin-dominance/model/dominance.ts';
import { type ITickerItem, tickerItemSchema } from '@/modules/ticker-selector';

export interface IState {
	selectedTickers: ITickerItem[];
	dateRange: DominanceDateRange;
	displaySettings: IDisplaySettings;
}

const displaySettingsSchema = z.object({
	isShowHistorical: z.boolean(),
	isShowIndicator: z.boolean(),
	isShowChart: z.boolean(),
});

export const stateSchema = z.object({
	selectedTickers: z.array(tickerItemSchema),
	dateRange: z.nativeEnum(DominanceDateRange),
	displaySettings: displaySettingsSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		selectedTickers: [],
		dateRange: DominanceDateRange.All,
		displaySettings: {
			isShowHistorical: true,
			isShowIndicator: true,
			isShowChart: true,
		},
	};
}

import { z } from 'zod';

import { type IDisplaySettings } from './display';
import { DominanceDateRange } from '@/modules/widgets/bitcoin-dominance/model/dominance.ts';
import { type ITickerItem, tickerItemSchema } from '@/modules/ticker-selector';
import { MarketType } from '@/modules/market';

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
		selectedTickers: [
			{
				canonical_ticker_id: 'Crypto-BTC_Bitcoin',
				market_type: MarketType.Crypto,
				symbol: 'BTC',
				name: 'Bitcoin',
				logo: '',
			},
			{
				canonical_ticker_id: 'Crypto-ETH_Ethereum',
				market_type: MarketType.Crypto,
				symbol: 'ETH',
				name: 'Ethereum',
				logo: '',
			},
		],
		dateRange: DominanceDateRange.All,
		displaySettings: {
			isShowHistorical: true,
			isShowIndicator: true,
			isShowChart: true,
		},
	};
}

import { z } from 'zod';

import { type IDisplaySettings } from './display';
import { DominanceDateRange } from '@/modules/widgets/bitcoin-dominance/model/dominance.ts';
import type { WidgetState } from '@/modules/dashboard-group';

export interface IState extends WidgetState {
	selectedTickers: string[];
	dateRange: DominanceDateRange;
	displaySettings: IDisplaySettings;
}

const displaySettingsSchema = z.object({
	isShowHistorical: z.boolean(),
	isShowIndicator: z.boolean(),
	isShowChart: z.boolean(),
});

export const stateSchema = z.object({
	selectedTickers: z.array(z.string()),
	dateRange: z.nativeEnum(DominanceDateRange),
	displaySettings: displaySettingsSchema,
});

export type StateSchemaType = z.infer<typeof stateSchema>;

export function getDefaultState(): IState {
	return {
		selectedTickers: ['Crypto-BTC_Bitcoin', 'Crypto-ETH_Ethereum'],
		dateRange: DominanceDateRange.All,
		displaySettings: {
			isShowHistorical: true,
			isShowIndicator: true,
			isShowChart: true,
		},
	};
}

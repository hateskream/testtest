import { z } from 'zod';

import { MarketType } from '../model';

const ISettingsSchema = z.object({
	isShowChart: z.boolean(),
	isShowPercentageChange: z.boolean(),
	isShowLogo: z.boolean(),
	isShowTicker: z.boolean(),
	isShowDescription: z.boolean(),
});

export const stateSchema = z.object({
	activeMarket: z.nativeEnum(MarketType),
	settings: z.object({
		[MarketType.Crypto]: z.object({
			display: ISettingsSchema,
			pinned: z.array(z.string()),
		}),
		[MarketType.Stock]: z.object({
			display: ISettingsSchema,
			pinned: z.array(z.string()),
		}),
		[MarketType.Forex]: z.object({
			display: ISettingsSchema,
			pinned: z.array(z.string()),
		}),
		[MarketType.Commodities]: z.object({
			display: ISettingsSchema,
			pinned: z.array(z.string()),
		}),
		[MarketType.Indices]: z.object({
			display: ISettingsSchema,
			pinned: z.array(z.string()),
		}),
	}),
});

export type StateSchemaType = z.infer<typeof stateSchema>;



import { z } from 'zod';

import { MarketType } from '@/modules/market';
import { ColumnType } from '@/modules/cell';

const columnSchema = z.object({
	columnType: z.nativeEnum(ColumnType),
	isShow: z.boolean(),
	order: z.number(),
});

const filterSchema = z.object({
	filterType: z.string(),
	selected: z.string(),
});

const settingsSchema = z.object({
	column: z.array(columnSchema),
	sort: z.object({
		columnType: z.string(),
		sortDirection: z.string(),
	}).nullish(),
	filters: z.array(filterSchema),
});

export const stateSchema = z.object({
	activeMarket: z.nativeEnum(MarketType),
	settings: z.object({
		[MarketType.Crypto]: settingsSchema,
		[MarketType.Stock]: settingsSchema,
		[MarketType.Forex]: settingsSchema,
		[MarketType.Commodities]: settingsSchema,
		[MarketType.Indices]: settingsSchema,
	}),
});

export type StateSchemaType = z.infer<typeof stateSchema>;



import { z } from 'zod';

import { ColumnType } from '@/modules/cell';
import { FilterOperator, ScreenerMarket, ScreenerType } from '../model';

const columnSchema = z.object({
	columnType: z.nativeEnum(ColumnType),
	isShow: z.boolean(),
	order: z.number(),
});

const filterSchema = z.object({
	filterType: z.string(),
	selected: z.object({
		operator: z.nativeEnum(FilterOperator),
		right: z.array(z.number().or(z.string())).or(z.string()).or(z.number()),
	}).or(z.null()),
	presetId: z.string().or(z.undefined()),
});

const settingsSchema = z.object({
	column: z.array(columnSchema),
	sort: z.object({
		columnType: z.string(),
		sortDirection: z.string(),
	}).nullish(),
	filters: z.array(filterSchema),
	markets: z.array(z.nativeEnum(ScreenerType).or(z.nativeEnum(ScreenerMarket))),
});

export const stateSchema = z.object({
	activeScreenerType: z.nativeEnum(ScreenerType),
	settings: z.object({
		[ScreenerType.Stock]: settingsSchema,
		[ScreenerType.Crypto]: settingsSchema,
		[ScreenerType.ETF]: settingsSchema,
		[ScreenerType.Bond]: settingsSchema,
		[ScreenerType.CEX]: settingsSchema,
		[ScreenerType.DEX]: settingsSchema,
	}),
});

export type StateSchemaType = z.infer<typeof stateSchema>;



import { z } from 'zod';

import { ColumnType, SortDirection } from '@/modules/cell';
import { MarketType } from '@/modules/market';
import { SpecificSectionType } from '../model';

const sortSchema = z.object({
	columnType: z.nativeEnum(ColumnType),
	sortDirection: z.nativeEnum(SortDirection),
});

const tickerStateSchema = z.object({
	isShowLogo: z.boolean(),
	isShowTicker: z.boolean(),
	isShowDescription: z.boolean(),
});

const columnSchema = z.object({
	columnType: z.nativeEnum(ColumnType),
	isShow: z.boolean(),
	order: z.number(),
});

const sectionTypeSchema = z.union([z.nativeEnum(MarketType), z.nativeEnum(SpecificSectionType)]);

const rowSchema = z.object({
	id: z.string(),
});

const sectionSchema = z.object({
	id: z.string(),
	name: z.string(),
	isOpen: z.boolean(),
	type: sectionTypeSchema,
	rows: z.array(rowSchema),
});

const tableSchema = z.object({
	id: z.string(),
	columns: z.array(columnSchema),
	sections: z.array(sectionSchema),
	tickerState: tickerStateSchema,
	sort: sortSchema.nullable(),
});

const tabSchema = z.object({
	id: z.string(),
	name: z.string(),
	order: z.number(),
	table: tableSchema,
});

export const stateSchema = z.object({
	activeTabId: z.string().nullable(),
	tabs: z.array(tabSchema),
});

export type StateSchemaType = z.infer<typeof stateSchema>;



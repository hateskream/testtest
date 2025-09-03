import { z } from 'zod';

import { ColumnType, SortDirection } from '@/modules/cell';

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

const sectionSchema = z.object({
	id: z.string(),
	isOpen: z.boolean(),
});

const tableSchema = z.object({
	id: z.string(),
	columns: z.array(columnSchema),
	sections: z.array(sectionSchema),
	tickerState: tickerStateSchema,
	sort: sortSchema.nullable(),
});

export const stateSchema = z.object({
	activeTableId: z.string().nullable(),
	tables: z.array(tableSchema),
});

export type StateSchemaType = z.infer<typeof stateSchema>;



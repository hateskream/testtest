import { z } from 'zod';

import { TitleViewVariant } from '../model';

const TitleViewVariantSchema = z.enum([
	TitleViewVariant.TICKER,
	TitleViewVariant.NAME,
	TitleViewVariant.NONE,
]);

export const DisplayStateSchemaC = z.object({
	sizeBy: z.string().optional(),
	groupBy: z.string().optional(),
	colorBy: z.string(),
	colorDepth: z.string(),
	displayValue: z.string(),
	isShowLogo: z.boolean(),
	titleSetting: TitleViewVariantSchema,
});

export const stateSchema = z.object({
	activeMarketId: z.string(),
	settings: z.record(z.string(), DisplayStateSchemaC),
});

export type StateSchemaType = z.infer<typeof stateSchema>;



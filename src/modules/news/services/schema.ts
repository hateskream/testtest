import { z } from 'zod';

import { Include, Score, Sentiment, Sort, Source } from '@/modules/news';
import { MarketType } from '@/modules/market';
import type { IDateRange } from '@/shared/ui/calendar';
import type { DateYYYYMMDD } from '../model';

const displaySettingsSchema = z.object({
	isShowDate: z.boolean(),
	isShowSource: z.boolean(),
	isShowDesc: z.boolean(),
	isShowAuthor: z.boolean(),
	isShowSymbols: z.boolean(),
	isShowScore: z.boolean(),
});

const activeLocationSchema = z.object({
	region: z.string(),
	countries: z.array(z.string()),
});


const dateStringSchema = z
	.string()
	.regex(/^\d{4}-\d{2}-\d{2}$/)
	.transform(v => v as DateYYYYMMDD);

export const dateRangeSchema = z.object({
	from: dateStringSchema,
	to: dateStringSchema,
}) as z.ZodType<IDateRange>;

export const stateSchema = z.object({
	score: z.array(z.nativeEnum(Score)),
	segments: z.array(z.nativeEnum(MarketType)),
	sentiment: z.array(z.nativeEnum(Sentiment)),
	source: z.array(z.nativeEnum(Source)),
	selectedTickers: z.array(z.string()),
	activeSort: z.nativeEnum(Sort).nullable(),
	displaySettings: displaySettingsSchema,
	locations: z.array(activeLocationSchema),
	include: z.array(z.nativeEnum(Include)),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

import { z } from 'zod';

import { Score, Sentiment, Sort, Source } from '@/modules/news';
import { MarketType } from '@/modules/market';

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

export const stateSchema = z.object({
	score: z.array(z.nativeEnum(Score)),
	segments: z.array(z.nativeEnum(MarketType)),
	sentiment: z.array(z.nativeEnum(Sentiment)),
	source: z.array(z.nativeEnum(Source)),
	selectedTickers: z.array(z.string()),
	activeSort: z.nativeEnum(Sort).nullable(),
	displaySettings: displaySettingsSchema,
	locations: z.array(activeLocationSchema),
});

export type StateSchemaType = z.infer<typeof stateSchema>;

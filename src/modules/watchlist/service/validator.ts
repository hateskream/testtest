import { z } from 'zod';

import { MarketType } from '@/modules/market';
import { SpecificSectionType } from '../model';

const sectionSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.union([z.nativeEnum(MarketType), z.nativeEnum(SpecificSectionType)]),
	tickerIds: z.array(z.string()),
});

const watchlistSchema = z.object({
	id: z.string(),
	name: z.string(),
	sections: z.array(sectionSchema),
});

export const stateSchema = z.array(watchlistSchema);

export type StateSchemaType = z.infer<typeof stateSchema>;



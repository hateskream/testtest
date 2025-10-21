import { z } from 'zod';

import { EventType, Impact, MarketIds } from '../models';

export const toolbarSchema = z.object({
	marketId: z.array(z.nativeEnum(MarketIds)),
	impact: z.array(z.nativeEnum(Impact)),
	eventType: z.array(z.nativeEnum(EventType)),
	watchlistId: z.string().nullable(),
	watchlistSection: z.string().nullable(),
});

export type ToolbarSchemaType = z.infer<typeof toolbarSchema>;

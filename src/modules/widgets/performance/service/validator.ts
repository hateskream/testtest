import { z } from 'zod';

import { DateRange, DisplayVariant, Stock } from '../model';

export const stateSchema = z.object({
	stock: z.nativeEnum(Stock),
	date: z.nativeEnum(DateRange),
	displayVariant: z.nativeEnum(DisplayVariant),
	isCompactMode: z.boolean(),
});

export type StateSchemaType = z.infer<typeof stateSchema>;



import { z } from 'zod';

import { periods } from '@/modules/widgets/altcoinSeason/model';

export const periodSchema = z.enum(periods);

export const marketSchema = z.enum(['BTC']);

export const modulesSchema = z.object({
	performanceRank: z.boolean(),
	historicalValues: z.boolean(),
	top100: z.boolean(),
	chart: z.boolean(),
});

export const altcoinSeasonSchema = z.object({
	period: periodSchema,
	market: marketSchema,
	modules: modulesSchema,
});

export type AltcoinSeasonSchemaType = z.infer<typeof altcoinSeasonSchema>;

import { z } from 'zod';

export const EpsTilesStatus = {
	Beat: 'beat',
	Miss: 'miss',
	Upcoming: 'upcoming',
} as const;

export const EpsTilesItemSchema = z.object({
	quarter: z.string(),
	eps: z.number().nullable(),
	eps_estimate: z.number().nullable(),
	revenue: z.string().nullable(),
	change: z.number().nullable(),
	status: z.nativeEnum(EpsTilesStatus),
	date: z.string().datetime().nullable(),
});

export const EpsTilesDataSchema = z.object({
	items: z.array(EpsTilesItemSchema),
});

export type EpsTilesItem = z.infer<typeof EpsTilesItemSchema>;
export type EpsTilesData = z.infer<typeof EpsTilesDataSchema>;

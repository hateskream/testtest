import { z } from 'zod';

import { DateRangePreset } from '@/modules/lightweight-charts/model';

export const PriceChangesSchema = z.object({
	[DateRangePreset.Day]: z.number(),
	[DateRangePreset.Week]: z.number(),
	[DateRangePreset.Month]: z.number(),
	[DateRangePreset.SixMonths]: z.number(),
	[DateRangePreset.Year]: z.number(),
	[DateRangePreset.All]: z.number(),
});

export type PriceChanges = z.infer<typeof PriceChangesSchema>;

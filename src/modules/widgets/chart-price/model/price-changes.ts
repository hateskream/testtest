import { z } from 'zod';

import { ChartPriceDateRangePreset } from './date-range.ts';

export const PriceChangesSchema = z.object({
	[ChartPriceDateRangePreset.Day]: z.number(),
	[ChartPriceDateRangePreset.Week]: z.number(),
	[ChartPriceDateRangePreset.Month]: z.number(),
	[ChartPriceDateRangePreset.SixMonths]: z.number(),
	[ChartPriceDateRangePreset.Year]: z.number(),
	[ChartPriceDateRangePreset.All]: z.number(),
});

export type PriceChanges = z.infer<typeof PriceChangesSchema>;

import { z } from 'zod';

export const CapitalMetricSchema = z.object({
	label: z.string(),
	description: z.string(),
	value: z.string().nullish(),
	unit: z.string().nullish(),
});

export const CapitalMetricsSchema = z.object({
	tickerId: z.string(),
	metrics: z.array(CapitalMetricSchema),
});

export type CapitalMetrics = z.infer<typeof CapitalMetricsSchema>;

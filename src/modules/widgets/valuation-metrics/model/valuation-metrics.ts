import { z } from 'zod';

export const ValuationMetricItemSchema = z.object({
	label: z.string(),
	description: z.string(),
	ltm: z.string().nullish(),
	ntm: z.string().nullish(),
	unit: z.string().nullish(),
});

export const ValuationMetricsSchema = z.object({
	tickerId: z.string(),
	metrics: z.array(ValuationMetricItemSchema),
});

export type ValuationMetricItem = z.infer<typeof ValuationMetricItemSchema>;
export type ValuationMetrics = z.infer<typeof ValuationMetricsSchema>;

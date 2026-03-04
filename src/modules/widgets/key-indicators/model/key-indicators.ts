import { z } from 'zod';

export const KeyIndicatorSchema = z.object({
	status: z.enum(['positive', 'negative', 'neutral']),
	label: z.string(),
});

export type IKeyIndicator = z.infer<typeof KeyIndicatorSchema>;

export const KeyIndicatorsResponseSchema = z.object({
	indicators: z.array(KeyIndicatorSchema),
	summarized: z.string().optional(),
	summarized_date: z.string().datetime().optional(),
});

export type IKeyIndicatorsResponse = z.infer<typeof KeyIndicatorsResponseSchema>;

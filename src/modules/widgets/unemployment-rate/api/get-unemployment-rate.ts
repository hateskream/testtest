import { z } from 'zod';

import { useLogger } from '@/shared/service/monitoring';
import { useApiClient } from '@/shared/service/api';

export interface IGetUnemploymentRateRequest {
	widgetId: string;
}

const UnemploymentRateChangeSchema = z.object({
	value: z.number().nullable(),
	unit: z.string(),
	direction: z.enum(['up', 'down', 'neutral']),
	isPositive: z.boolean(),
});

const UnemploymentRatePointSchema = z.object({
	label: z.string(),
	history: z.number(),
});

const GetUnemploymentRateResponseSchema = z.object({
	primaryValue: z.string(),
	primaryValueUnit: z.string(),
	change: UnemploymentRateChangeSchema,
	points: z.array(UnemploymentRatePointSchema).nonempty(),
});

type GetUnemploymentRateResponse = z.infer<typeof GetUnemploymentRateResponseSchema>;

export function getUnemploymentRate(
	args: IGetUnemploymentRateRequest,
): Promise<GetUnemploymentRateResponse> {
	const client = useApiClient();
	const logger = useLogger();

	try {
		return client.get(
			'/api/v1/unemployment-rate/data',
			GetUnemploymentRateResponseSchema,
			{
				query: {
					widgetId: args.widgetId,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get unemployment rate data', { error: error as Error });
		throw error;
	}
}

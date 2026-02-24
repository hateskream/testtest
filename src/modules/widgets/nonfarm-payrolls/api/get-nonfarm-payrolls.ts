import { z } from 'zod';

import { useLogger } from '@/shared/service/monitoring';
import { useApiClient } from '@/shared/service/api';

export interface IGetNonfarmPayrollsRequest {
	widgetId: string;
}

const NonfarmPayrollsChangeSchema = z.object({
	value: z.number().nullable(),
	unit: z.string(),
	direction: z.enum(['up', 'down', 'neutral']),
	isPositive: z.boolean(),
});

const NonfarmPayrollsPointSchema = z.object({
	label: z.string(),
	history: z.number(),
});

const GetNonfarmPayrollsResponseSchema = z.object({
	primaryValue: z.string(),
	primaryValueUnit: z.string(),
	change: NonfarmPayrollsChangeSchema,
	points: z.array(NonfarmPayrollsPointSchema),
});

type GetNonfarmPayrollsResponse = z.infer<typeof GetNonfarmPayrollsResponseSchema>;

export function getNonfarmPayrolls(
	args: IGetNonfarmPayrollsRequest,
): Promise<GetNonfarmPayrollsResponse> {
	const client = useApiClient();
	const logger = useLogger();

	try {
		return client.get(
			'/api/v1/nonfarm-payrolls/data',
			GetNonfarmPayrollsResponseSchema,
			{
				query: {
					widgetId: args.widgetId,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get nonfarm payrolls data', { error: error as Error });
		throw error;
	}
}

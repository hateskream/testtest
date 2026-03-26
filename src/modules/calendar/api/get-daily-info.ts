import { z } from 'zod';

import { getMockDailyInfo } from './mock';
import { useLogger } from '@/shared/service/monitoring';
import { useApiClient } from '@/shared/service/api';
import type { IDailyInfoRequest } from '../model/calendar';

const IS_USE_MOCK = false;

const DailyInfoMetricsSchema = z.object({
	crypto_events: z.number().optional(),
	dividends: z.number(),
	earnings: z.number(),
	economic: z.number(),
	ipo: z.number().optional(),
	news: z.number().optional(),
	splits: z.number().optional(),
});

const DailyInfoItemSchema = z.object({
	date: z.string(),
	metrics: DailyInfoMetricsSchema,
});

const GetDailyInfoResponseSchema = z.array(DailyInfoItemSchema).nonempty();

type GetDailyInfoResponse = z.infer<typeof GetDailyInfoResponseSchema>;

export async function getDailyInfo(options: IDailyInfoRequest): Promise<GetDailyInfoResponse> {
	try {
		return IS_USE_MOCK
			? GetDailyInfoResponseSchema.parse(await getMockDailyInfo())
			: getApiDailyInfo(options);
	} catch (error) {
		const logger = useLogger();
		logger.error('Failed to get daily calendar info', {
			error: error as Error,
		});
		throw error;
	}
}

function getApiDailyInfo(options: IDailyInfoRequest) {
	const client = useApiClient();

	return client.get('/api/v1/calendar/daily-info', GetDailyInfoResponseSchema, {
		query: {
			from: options.from,
			to: options.to,
		},
	});
}

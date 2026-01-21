import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import type { ActivityMetricsResponse, IActivityMetricsRequest } from './contract';
import { getMockData } from './mock';

const IS_USE_MOCK = true;

export async function getActivityMetrics(request: IActivityMetricsRequest) {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return await getMockData(request);
		}

		return httpService.get<ActivityMetricsResponse>('/api/v1/widget/insights-activity', {
			query: {
				ticker_id: request.tickerId,
			},
		});
	} catch (error) {
		logger.error('Failed to get ticker activity metrics', error as Error);
		throw error;
	}
}

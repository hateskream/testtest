import { useHttpService } from '@/shared/service/http-service.ts';
import { getMockDailyInfo } from './mock';
import { useLogger } from '@/shared/service/monitoring';
import type { IDailyInfoRequest, IDailyInfoResponse } from '../model/calendar';

const IS_USE_MOCK = false;

export async function getDailyInfo(options: IDailyInfoRequest): Promise<IDailyInfoResponse> {
	try {
		return IS_USE_MOCK ? getMockDailyInfo() : getApiDailyInfo(options);
	} catch (error) {
		const logger = useLogger();
		logger.error('Failed to get daily calendar info', {
			error: error as Error,
		});
		throw error;
	}
}

function getApiDailyInfo(options: IDailyInfoRequest) {
	const httpService = useHttpService();

	return httpService.get<IDailyInfoResponse>('/api/v1/calendar/daily-info', {
		query: {
			from: options.from,
			to: options.to,
		},
	});
}

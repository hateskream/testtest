import { useHttpService } from '@/shared/service/http-service.ts';
import { createMockApiDays } from './mock';
import { useLogger } from '@/shared/service/monitoring';
import type { IDailyCalendarInfoRequest, IDailyCalendarInfoResponse } from '@/modules/calendar';

const IS_USE_MOCK = false;

export async function getCalendarDays(options: IDailyCalendarInfoRequest): Promise<IDailyCalendarInfoResponse[]> {
	const logger = useLogger();

	try {
		return sendRequest(options);
	} catch (error) {
		logger.error('Failed to get display settings heatmap', { error: error as Error });
		throw error;
	}
}

function sendRequest(options: IDailyCalendarInfoRequest) {
	const httpService = useHttpService();

	if (IS_USE_MOCK) {
		return createMockApiDays(options);
	} else {
		return httpService.get<IDailyCalendarInfoResponse[]>('/api/v1/calendar/daily-info', {
			query: {
				from: options.from,
				to: options.to,
			},
		});
	}
}

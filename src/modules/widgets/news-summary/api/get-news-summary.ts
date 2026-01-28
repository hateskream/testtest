import { z } from 'zod';

import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import { useFetchMock } from '@/shared/mock';
import { delay } from '@/shared/lib';

const IS_USE_MOCK = false;

export interface IGetNewsSummaryResponse {
	sentiment: 'neutral' | 'optimistic' | 'pessimistic';
	summary: string;
	summarized_at: string;
}

const schema = z.object({
	sentiment: z.enum(['neutral', 'optimistic', 'pessimistic']),
	summary: z.string(),
	summarized_at: z.string().datetime(),
});

export async function getNewsSummary(): Promise<IGetNewsSummaryResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IGetNewsSummaryResponse>('/api/v1/news/summary');

		return schema.parse(response);
	} catch (error) {
		logger.error('Failed to get News Summary data', { error: error as Error });
		throw error;
	}
}

const { getMock } = useFetchMock<IGetNewsSummaryResponse>('/mock/widgets/news-summary.json');

async function getMockData() {
	await delay(500);
	return getMock();
}


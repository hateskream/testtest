import { useHttpService } from '@/shared/service/http-service';
import { delay } from '@/shared/lib';
import { useLogger } from '@/shared/service/monitoring';

const IS_USE_MOCK = false;

export interface ICurrentSentimentRequest {
	tickerId: string;
}

export interface ICurrentSentimentResponse {
	tension: number;
}

export function getCurrentSentiment(args: ICurrentSentimentRequest): Promise<ICurrentSentimentResponse> {
	return IS_USE_MOCK ? getCurrentSentimentMock() : getCurrentSentimentApi(args);
}

async function getCurrentSentimentMock(): Promise<ICurrentSentimentResponse> {
	await delay(500);

	return {
		tension: 35,
	};
}

function getCurrentSentimentApi(args: ICurrentSentimentRequest) {
	const httpService = useHttpService();

	try {
		return httpService.get<ICurrentSentimentResponse>('/api/v1/current-sentiment/data', {
			query: {
				ticker_id: args.tickerId,
			},
		});
	} catch (error) {
		const logger = useLogger();
		logger.error('Error fetching current sentiment', { error: error as Error });
		throw error;
	}
}

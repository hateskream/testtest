import { type IGetNewsDetailsRequest, type ITicker, Sentiment, Source } from '@/modules/news';
import { useHttpService } from '@/shared/service/http-service.ts';
import { useLogger } from '@/shared/service/logger';
import { getMockNewsDetailsData } from './mock/mock-news-details-data';

const IS_USE_MOCK = true;

export interface IGetNewsDetailsResponse {
	id: string;
	slug: string;
	title: string;
	article: string;
	date: number;
	sentiment: Sentiment;
	score: number;
	stocks: ITicker[];
	sources: Source[];
}

export async function getNewsDetails(req: IGetNewsDetailsRequest): Promise<IGetNewsDetailsResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	await new Promise(resolve => setTimeout(resolve, 2000));

	try {
		return IS_USE_MOCK
			? await getMockNewsDetailsData(req)
			: await httpService.get<IGetNewsDetailsResponse>(`/api/news/${req.id}`);
	} catch (error) {
		logger.error('Failed to get news details', error as Error);
		throw error;
	}
}

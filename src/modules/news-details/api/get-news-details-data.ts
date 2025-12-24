import { type IGetNewsDetailsRequest, type INewsSource, type ITicker, Sentiment } from '@/modules/news';
import { useHttpService } from '@/shared/service/http-service.ts';
import { useLogger } from '@/shared/service/logger';
import { getMockNewsDetailsData } from './mock/mock-news-details-data';
import { delay, getImagePath } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path.ts';

const IS_USE_MOCK = false;

export interface IGetNewsDetailsResponse {
	id: string;
	slug: string;
	title: string;
	article: string;
	date: number;
	sentiment: Sentiment;
	score: number;
	stocks: ITicker[];
	sources: INewsSource[];
}

// TODO: REFACTOR. Запланированный контракт (моки) отличается от реализованного.

export interface IGetNewsDetailsResponseItem {
	id: string;
	slug: string;
	author: string;
	first_seen_at: string;
	primary_title: string;
	summary: string;
	sentiment: {
		score: string;
		tone: string;
	};
	sources: INewsSource[];
	src_source_image: string;
	symbols: {
		image: string;
		label: string;
		market: string;
		ticker: string;
	}[];
	articles: {
		id: string;
		site: string;
		title: string;
		url: string;
	}[];
	updated_at: string;
}

export async function getNewsDetails(req: IGetNewsDetailsRequest): Promise<IGetNewsDetailsResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		if (IS_USE_MOCK) {
			return getMockData(req);
		}

		const response = await httpService.get<IGetNewsDetailsResponseItem>(`/api/v1/news/stories/${req.id}`);
		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get news details', error as Error);
		throw error;
	}
}

async function getMockData(req: IGetNewsDetailsRequest): Promise<IGetNewsDetailsResponse> {
	await delay(2000);
	return getMockNewsDetailsData(req);
}

function prepareResponse(item: IGetNewsDetailsResponseItem): IGetNewsDetailsResponse {
	return {
		id: item.id,
		slug: item.slug,
		title: item.primary_title,
		article: item.summary,
		date: Date.parse(item.updated_at),
		sentiment: item.sentiment.tone as Sentiment,
		sources: item.sources,
		stocks: item.symbols.map(symbol => ({
			ticker: symbol.ticker,
			name: symbol.label,
			srcImage: [getImagePath(symbol.ticker, ImageTypePath.Stock)],
		})),
		score: 0,
	};
}

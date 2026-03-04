import { z } from 'zod';

import { type IGetNewsDetailsRequest, Score, Sentiment } from '@/modules/news';
import type { INewsTicker } from '@/modules/news/api/get-news-data';
import { MarketType } from '@/modules/market';
import { useApiClient } from '@/shared/service/api';
import { useLogger } from '@/shared/service/monitoring';
import { getMockNewsDetailsData } from './mock/mock-news-details-data';
import { delay } from '@/shared/lib';

const IS_USE_MOCK = false;

const newsSourceSchema = z.object({
	site: z.string(),
	url: z.string(),
});

const newsSymbolSchema = z.object({
	ticker: z.string(),
	label: z.string(),
});

const newsArticleSchema = z.object({
	id: z.string(),
	title: z.string(),
	site: z.string(),
	url: z.string(),
});

const sentimentSchema = z.object({
	score: z.nativeEnum(Score),
	tone: z.nativeEnum(Sentiment),
});

/*
Старая zod-валидация. Сейчас API не готово, поэтому приходится мапить старый API ответ на новую модель

const newsTickerPriceSchema = z.object({
	change: z.string(),
	status: z.enum(['negative', 'neutral', 'positive']),
});

const newsTickerSchema = z.object({
	canonical_ticker_id: z.string(),
	market_type: z.nativeEnum(MarketType),
	symbol: z.string(),
	name: z.string(),
	logo: z.string().optional(),
	currency: z.string().optional(),
	currency_icon: z.string().optional(),
	price: newsTickerPriceSchema,
});

const newsDetailsSchema = z.object({
	id: z.string(),
	slug: z.string(),
	primary_title: z.string(),
	summary: z.string(),
	sentiment: sentimentSchema,
	tickers: z.array(newsTickerSchema).optional(),
	sources: z.array(newsSourceSchema),
	articles: z.array(newsArticleSchema),
	author: z.string().optional(),
	src_source_image: z.string().optional(),
	first_seen_at: z.string(),
	updated_at: z.string(),
});
*/

const newsDetailsApiSchema = z.object({
	id: z.string(),
	slug: z.string(),
	primary_title: z.string(),
	summary: z.string(),
	sentiment: sentimentSchema,
	symbols: z.array(newsSymbolSchema),
	sources: z.array(newsSourceSchema),
	articles: z.array(newsArticleSchema),
	src_source_image: z.string().optional(),
	first_seen_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});

type NewsDetailsApiResponse = z.infer<typeof newsDetailsApiSchema>;

export interface IGetNewsDetailsResponse {
	id: string;
	slug: string;
	primary_title: string;
	summary: string;
	sentiment: z.infer<typeof sentimentSchema>;
	tickers?: INewsTicker[];
	sources: z.infer<typeof newsSourceSchema>[];
	articles: z.infer<typeof newsArticleSchema>[];
	src_source_image?: string;
	first_seen_at: string;
	updated_at: string;
}

function mapSymbolToTicker(symbol: z.infer<typeof newsSymbolSchema>): INewsTicker {
	return {
		canonical_ticker_id: symbol.ticker,
		market_type: MarketType.Stock,
		symbol: symbol.ticker,
		name: symbol.label,
		price: { change: '', status: 'neutral' },
	};
}

export function mapResponse(response: NewsDetailsApiResponse): IGetNewsDetailsResponse {
	return {
		id: response.id,
		slug: response.slug,
		primary_title: response.primary_title,
		summary: response.summary,
		sentiment: response.sentiment,
		tickers: response.symbols.map(mapSymbolToTicker),
		sources: response.sources,
		articles: response.articles,
		src_source_image: response.src_source_image,
		first_seen_at: response.first_seen_at,
		updated_at: response.updated_at,
	};
}

export async function getNewsDetails(req: IGetNewsDetailsRequest): Promise<IGetNewsDetailsResponse> {
	const client = useApiClient();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? newsDetailsApiSchema.parse(await getMockData(req))
			: await client.get(`/api/v1/news/stories/${req.id}`, newsDetailsApiSchema);

		return mapResponse(response);
	} catch (error) {
		logger.error('Failed to get news details', { error: error as Error });
		throw error;
	}
}

async function getMockData(req: IGetNewsDetailsRequest) {
	await delay(2000);
	return getMockNewsDetailsData(req);
}

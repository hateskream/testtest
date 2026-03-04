import { z } from 'zod';

import { type IGetNewsRequest, type INews, Score, Sentiment } from '../model';
import { useLogger } from '@/shared/service/monitoring';
import { useApiClient } from '@/shared/service/api';
import { getMockNewsData } from '@/modules/news/api/mock/mock-news-data.ts';
import { MarketType } from '@/modules/market';

const IS_USE_MOCK = false;

export interface IPagination {
	total: number;
	offset: number;
	limit: number;
}

export interface IGetNewsResponse {
	data: INews[];
	pagination: IPagination;
}

export interface INewsTickerPrice {
	change: string;
	status: 'negative' | 'neutral' | 'positive';
}

export interface INewsTicker {
	canonical_ticker_id: string;
	market_type: MarketType;
	symbol: string;
	name: string;
	logo?: string;
	currency?: string;
	currency_icon?: string;
	price: INewsTickerPrice;
}

const newsSymbolSchema = z.object({
	ticker: z.string(),
	label: z.string(),
});

/*
Старая zod-валидация. Сейчас API не готово, поэтому приходится мапить старый API ответ на новую модель

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

const GetNewsResponseItemSchema = z.object({
	id: z.string(),
	author: z.string().optional(),
	first_seen_at: z.string(),
	primary_title: z.string(),
	sentiment: z.object({
		score: z.nativeEnum(Score),
		tone: z.nativeEnum(Sentiment),
	}),
	slug: z.string(),
	snippet: z.string(),
	sources_count: z.number(),
	src_source_image: z.string().optional(),
	tickers: z.array(newsTickerSchema),
	updated_at: z.string(),
});

export const GetNewsResponseSchema = z.object({
	pagination: z.object({
		total: z.number(),
		limit: z.number(),
		offset: z.number(),
	}),
	data: z.array(GetNewsResponseItemSchema),
});
*/

const GetNewsResponseItemSchema = z.object({
	id: z.string(),
	slug: z.string(),
	primary_title: z.string(),
	snippet: z.string(),
	sentiment: z.object({
		score: z.nativeEnum(Score),
		tone: z.nativeEnum(Sentiment),
	}),
	symbols: z.array(newsSymbolSchema),
	sources_count: z.number(),
	src_source_image: z.string().optional(),
	first_seen_at: z.string().datetime(),
	updated_at: z.string().datetime(),
});

export const GetNewsResponseSchema = z.array(GetNewsResponseItemSchema);

export type GetNewsResponseItem = z.infer<typeof GetNewsResponseItemSchema>;

function mapSymbolToTicker(symbol: z.infer<typeof newsSymbolSchema>): INewsTicker {
	return {
		canonical_ticker_id: symbol.ticker,
		market_type: MarketType.Stock,
		symbol: symbol.ticker,
		name: symbol.label,
		price: { change: '+1.17%', status: 'neutral' },
	};
}

export function mapResponseToNews(items: GetNewsResponseItem[]): INews[] {
	return items.map((item) => ({
		id: item.id,
		slug: item.slug,
		primary_title: item.primary_title,
		snippet: item.snippet,
		sentiment: item.sentiment,
		sources_count: item.sources_count,
		src_source_image: item.src_source_image,
		tickers: item.symbols.map(mapSymbolToTicker),
		first_seen_at: item.first_seen_at,
		updated_at: item.updated_at,
	}));
}

export async function getNews(req: IGetNewsRequest): Promise<IGetNewsResponse> {
	const client = useApiClient();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? GetNewsResponseSchema.parse(await getMockNewsData(req))
			: await client.get('/api/v1/news/stories', GetNewsResponseSchema, { query: createQuery(req) });

		return {
			data: mapResponseToNews(response),
			pagination: {
				total: response.length,
				offset: req.offset,
				limit: req.limit,
			},
		};
	} catch (error) {
		logger.error('Failed to get news', { error: error as Error });
		throw error;
	}
}

function createQuery({
	offset,
	limit,
	activeSort,
	dateTo,
	dateFrom,
}: IGetNewsRequest): Record<string, string | number> {
	const query: Record<string, string | number> = {
		category: 'general',
		offset,
		limit,
	};

	if (activeSort) {
		query.sort = activeSort;
	}

	// if (score.size > 0) {
	// 	[query.score] = Array.from(score);
	// }

	// if (sentiment.size > 0) {
	// 	[query.sentiment] = Array.from(sentiment);
	// }

	// if (selectedTickers.length) {
	// 	query.symbol = selectedTickers.join(',');
	// }

	if (dateTo) {
		query.date_to = (new Date(dateTo)).toJSON();
	}

	if (dateFrom) {
		query.date_from = (new Date(dateFrom)).toJSON();
	}

	// TODO: location, locations, date_from, date_to

	return query;

	// locations.forEach(item => {
	// 	params.append('region', item.region);
	// 	item.countries.forEach(country => {
	// 		params.append('countries', country);
	// 	});
	// });
	//
	// if (segment.isAllTickersShow) {
	// 	params.append('isAllTickersShow', 'true');
	// }
	//
	// if (segment.selectAllFrom.length) {
	// 	params.append('selectAllFrom', arrayToString(segment.selectAllFrom));
	// }
	//
	// if (segment.selectTickers.length) {
	// 	params.append('selectTickers', arrayToString(segment.selectTickers));
	// }
	//
	// if (source.size) {
	// 	params.append('source', arrayToString(Array.from(source)));
	// }
}

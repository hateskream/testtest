import { useHttpService } from '@/shared/service/http-service';
import { type IGetNewsRequest, type INews } from '../model';
import { useLogger } from '@/shared/service/monitoring';
import { getImagePath } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';
import { getMockNewsData } from '@/modules/news/api/mock/mock-news-data.ts';

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

// TODO: REFACTOR. Запланированный контракт (моки) отличается от реализованного.

export interface IGetNewsResponseItem {
	id: string;
	author: string;
	first_seen_at: string;
	primary_title: string;
	sentiment: {
		score: string;
		tone: string;
	};
	slug: string;
	snippet: string;
	sources_count: number;
	src_source_image: string;
	symbols: {
		image: string;
		label: string;
		market: string;
		ticker: string;
	}[];
	updated_at: string;
}

export async function getNews(req: IGetNewsRequest): Promise<IGetNewsResponse> {
	const httpService = useHttpService();
	const logger = useLogger();


	try {
		if (IS_USE_MOCK) {
			const response = await getMockNewsData(req);
			return prepareMockResponse(response);
		}

		const query = createQuery(req);

		const response = await httpService.get<IGetNewsResponseItem[]>(
			'/api/v1/news/stories',
			{ query },
		);

		return prepareResponse(response);
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
	// 	query.sentiment = Array.from(sentiment)[0].toLowerCase();
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

function prepareMockResponse({ data, pagination }: IGetNewsResponse): IGetNewsResponse {
	return {
		pagination,
		data: data.map(item => ({
			...item,
			srcSourceImage: '',
			stocks: item.stocks.map(stock => ({
				...stock,
				srcImage: [getImagePath(stock.ticker, ImageTypePath.Stock)],
			})),
		})),
	};
}

function prepareResponse(items: IGetNewsResponseItem[]): IGetNewsResponse {
	return {
		pagination: {
			total: items.length,
			limit: items.length,
			offset: 0,
		},
		data: items.map(item => {
			return {
				id: item.id,
				slug: item.slug,
				title: item.primary_title,
				description: item.snippet,
				timestamp: Date.parse(item.updated_at),
				srcSourceImage: item.src_source_image,

				author: '',
				score: 0,
				stocks: item.symbols.map(symbol => ({
					ticker: symbol.ticker,
					name: symbol.label,
					srcImage: [getImagePath(symbol.ticker, ImageTypePath.Stock)],
				})),
			};
		}),
	};
}

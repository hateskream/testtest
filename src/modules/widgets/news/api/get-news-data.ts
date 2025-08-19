import { useHttpService } from '@/shared/service/http-service';
import {
	Score,
	Sentiment,
	Source,
	type IActiveLocation,
	type INews,
	type SortState,
} from '../model';
import { useLogger } from '@/shared/service/logger';
import { arrayToString, getImagePath } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';
import type { MarketType } from '@/modules/market';

const IS_USE_MOCK = true;

export interface IGetNewsRequest {
	offset: number;
	limit: number;
	score: Set<Score>;
	segment: Set<MarketType>;
	sentiment: Set<Sentiment>;
	source: Set<Source>;
	selectedTickers: string[];
	activeSort: SortState;
	locations: IActiveLocation[];
}


export interface IPagination {
	total: number;
	offset: number;
	limit: number;
}

export interface IGetNewsResponse {
	data: INews[];
	pagination: IPagination;
}

export async function getNews(req: IGetNewsRequest): Promise<IGetNewsResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = createQuery(req);

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IGetNewsResponse>(`/api/news?${query}`);

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get news', error as Error);
		throw error;
	}
}

function createQuery({
	offset,
	limit,
	score,
	segment,
	sentiment,
	source,
	selectedTickers,
	activeSort,
	locations,
}: IGetNewsRequest): string {
	const params = new URLSearchParams({
		offset: offset.toString(),
		limit: 	limit.toString(),
	});

	locations.forEach(item => {
		params.append('region', item.region);
		item.countries.forEach(country => {
			params.append('countries', country);
		});
	});

	if (score.size) {
		params.append('score', arrayToString(Array.from(score)));
	}

	if (segment.size) {
		params.append('segment', arrayToString(Array.from(segment)));
	}

	if (sentiment.size) {
		params.append('sentiment', arrayToString(Array.from(sentiment)));
	}

	if (source.size) {
		params.append('source', arrayToString(Array.from(source)));
	}

	if (selectedTickers.length) {
		params.append('tickers', arrayToString(selectedTickers));
	}

	if (activeSort) {
		params.append('sort', activeSort);
	}

	return params.toString();
}

function prepareResponse({ data, pagination }: IGetNewsResponse): IGetNewsResponse {
	return {
		pagination,
		data: data.map(item => ({
			...item,
			srcSourceImage: '',
			stocks: item.stocks.map(stock => ({
				...stock,
				srcImage: getImagePath(stock.ticker, ImageTypePath.Stock),
			})),
		})),
	};
}


async function getMockData(): Promise<IGetNewsResponse> {
	const mockData: INews[] = [
		{
			author: 'Jesse Choafohen-Phosteghedos',
			description: 'As we navigate through 2025, the landscape of technology stocks presents',
			id: '1',
			score: 50,

			stocks: [
				{
					name: 'Tesla Inc',
					ticker: 'TSLA',
					srcImage: '1',
				},
				{
					name: 'Meta Platforms',
					ticker: 'META',
					srcImage: '1',
				},
			],

			title: '2 AI Stocks Down More Than 20% YTD to Buy Before They Soar',
			timestamp: new Date().getTime(),
			srcSourceImage: '1',
		},

		{
			author: 'Jesse Cohen',
			description: 'As we navigate through 2025, the landscape of technology stocks presents',
			id: '2',
			score: 76,

			stocks: [
				{
					name: 'Tesla Inc',
					ticker: 'TSLA',
					srcImage: '1',
				},
				{
					name: 'Meta Platforms',
					ticker: 'META',
					srcImage: '1',
				},
			],

			title: '2 AI Stocks Down More Than 20% YTD to Buy Before They Soar',
			timestamp: new Date().getTime(),
			srcSourceImage: '1',
		},

		{
			author: 'Jesse Cohen',
			description: 'As we navigate through 2025, the landscape of technology stocks presents',
			id: '2',
			score: 32,

			stocks: [
				{
					name: 'Tesla Inc',
					ticker: 'TSLA',
					srcImage: '1',
				},
				{
					name: 'Meta Platforms',
					ticker: 'META',
					srcImage: '1',
				},
			],

			title: '2 AI Stocks Down More Than 20% YTD to Buy Before They Soar',
			timestamp: new Date().getTime(),
			srcSourceImage: '1',
		},

		{
			author: 'Jesse Cohen',
			description: 'As we navigate through 2025, the landscape of technology stocks presents',
			id: '2',
			score: 10,

			stocks: [
				{
					name: 'Tesla Inc',
					ticker: 'TSLA',
					srcImage: '1',
				},
				{
					name: 'Meta Platforms',
					ticker: 'META',
					srcImage: '1',
				},
			],

			title: '2 AI Stocks Down More Than 20% YTD to Buy Before They Soar',
			timestamp: new Date().getTime(),
			srcSourceImage: '1',
		},
	];

	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const response: IGetNewsResponse = {
		data: mockData,
		pagination: {
			offset: 0,
			limit: 10,
			total: 10,
		},
	};

	return response;
}

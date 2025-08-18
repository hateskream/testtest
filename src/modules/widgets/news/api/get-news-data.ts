import { useHttpService } from '@/shared/service/http-service';
import {
	Sentiment,
	Source,
	type INews as INewsDomain,
	type INewsStock,
} from '../model';
import { useLogger } from '@/shared/service/logger';
import { getImagePath } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';
import { MarketType } from '@/modules/market';

const IS_USE_MOCK = true;


type INews = Omit<INewsDomain, 'stocks' | 'srcSourceImage'> & {
	stocks: Omit<INewsStock, 'srcImage'>[];
};

export interface IGetNewsResponse {
	data: INews[];
}

export async function getNews(): Promise<INewsDomain[] | null> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IGetNewsResponse>('/api/news');

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get news', error as Error);
		throw error;
	}
}

function prepareResponse(response: IGetNewsResponse): INewsDomain[] {
	return response.data.map(item => ({
		...item,
		srcSourceImage: getImagePath(item.source, ImageTypePath.Stock),
		stocks: item.stocks.map(stock => ({
			...stock,
			srcImage: getImagePath(stock.ticker, ImageTypePath.Stock),
		})),
	}));
}

async function getMockData(): Promise<IGetNewsResponse> {
	const mockData: INews[] = [
		{
			author: 'Jesse Choafohen-Phosteghedos',
			description: 'As we navigate through 2025, the landscape of technology stocks presents',
			id: '1',
			location: {
				name: 'United States',
				code: 'us',
			},
			score: 50,
			sentiment: Sentiment.Neutral,
			source: Source.InvestingCom,
			stocks: [
				{
					name: 'Tesla Inc',
					ticker: 'TSLA',
				},
				{
					name: 'Meta Platforms',
					ticker: 'META',
				},
			],
			segment: MarketType.Crypto,
			title: '2 AI Stocks Down More Than 20% YTD to Buy Before They Soar',
			timestamp: new Date().getTime(),
		},

		{
			author: 'Jesse Cohen',
			description: 'As we navigate through 2025, the landscape of technology stocks presents',
			id: '2',
			location: {
				name: 'United States',
				code: 'us',
			},
			score: 76,
			sentiment: Sentiment.Neutral,
			source: Source.InvestingCom,
			stocks: [
				{
					name: 'Tesla Inc',
					ticker: 'TSLA',
				},
				{
					name: 'Meta Platforms',
					ticker: 'META',
				},
			],
			segment: MarketType.Crypto,
			title: '2 AI Stocks Down More Than 20% YTD to Buy Before They Soar',
			timestamp: new Date().getTime(),
		},

		{
			author: 'Jesse Cohen',
			description: 'As we navigate through 2025, the landscape of technology stocks presents',
			id: '2',
			location: {
				name: 'United States',
				code: 'us',
			},
			score: 32,
			sentiment: Sentiment.Neutral,
			source: Source.InvestingCom,
			stocks: [
				{
					name: 'Tesla Inc',
					ticker: 'TSLA',
				},
				{
					name: 'Meta Platforms',
					ticker: 'META',
				},
			],
			segment: MarketType.Crypto,
			title: '2 AI Stocks Down More Than 20% YTD to Buy Before They Soar',
			timestamp: new Date().getTime(),
		},

		{
			author: 'Jesse Cohen',
			description: 'As we navigate through 2025, the landscape of technology stocks presents',
			id: '2',
			location: {
				name: 'United States',
				code: 'us',
			},
			score: 10,
			sentiment: Sentiment.Neutral,
			source: Source.InvestingCom,
			stocks: [
				{
					name: 'Tesla Inc',
					ticker: 'TSLA',
				},
				{
					name: 'Meta Platforms',
					ticker: 'META',
				},
			],
			segment: MarketType.Crypto,
			title: '2 AI Stocks Down More Than 20% YTD to Buy Before They Soar',
			timestamp: new Date().getTime(),
		},
	];

	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const response: IGetNewsResponse = {
		data: mockData,
	};

	return response;
}

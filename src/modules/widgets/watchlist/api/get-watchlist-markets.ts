import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { MarketType, type IWatchlistSection } from '../model';
import { getImagePath, removeUndefinedPropertiesFromObject } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';

const IS_USE_MOCK = true;

export interface IGetWatchlistRequest {
	market: string;
	sort?: string;
}

export interface IGetWatchlistResponse {
	data: IWatchlistSection[];
}

export async function getWatchlist(args: IGetWatchlistRequest): Promise<IWatchlistSection[]> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = removeUndefinedPropertiesFromObject(args);

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IGetWatchlistResponse>('/api/watchlist', {
				query,
			});

		return prepareResponse(response.data);
	} catch (error) {
		logger.error('Failed to get watchlist', error as Error);
		throw error;
	}
}

function prepareResponse(data: IWatchlistSection[]): IWatchlistSection[] {
	return data.map(sectionItem => ({
		...sectionItem,
		watchlist: sectionItem.watchlist.map(marketItem => ({
			...marketItem,
			srcValue: getImagePath(marketItem.symbol, ImageTypePath.Currency),
			srcValue2: sectionItem.type === MarketType.Forex && marketItem.domain
				? getImagePath(marketItem.domain, ImageTypePath.Currency)
				: '',
		}),
		),
	}
	));
}

async function getMockData(): Promise<IGetWatchlistResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const mockData: IWatchlistSection[] = [
		{
			id: '1',
			name: 'Crypto',
			type: MarketType.Crypto,
			isOpen: true,
			watchlist:[
				{
					id: '1',
					chg24h: '0',
					price: '137.4',
					volume24h: '11723737.43',
					marketCap24h: '22737283.45',
					symbol: 'ADA',
					domain: 'Cardano',
					listingDate: new Date('2024-04-30').toString(),
					chg1h: '12',
					chg7d: '15',
				},
				{
					id: '2',
					chg24h: '-2.93',
					price: '635.4',
					volume24h: '323737.43',
					marketCap24h: '37283.45',
					symbol: 'BNB',
					domain: 'Binance Coin',
					listingDate: new Date('2025-04-12').toString(),
					chg1h: '32',
					chg7d: '-42',
				},
				// {
				// 	id: '3',
				// 	chg24h: '0.86',
				// 	price: '97432.7',
				// 	volume24h: '32374523437.43',
				// 	marketCap24h: '372853453.45',
				// 	symbol: 'BTC',
				// 	domain: 'Bitcoin',
				// 	listingDate: new Date('2023-06-15').toString(),
				// 	chg1h: '-12',
				// 	chg7d: '49',
				// },
				{
					id: '4',
					chg24h: '0.23',
					price: '23645.7',
					volume24h: '7637984137.43',
					marketCap24h: '346353453.45',
					symbol: 'NOIMG',
					listingDate: new Date('2023-06-15').toString(),
					chg1h: '-12',
					chg7d: '49',
				},
			],
		},
		{
			id: '2',
			name: 'Stocks',
			type: MarketType.Stock,
			isOpen: true,
			watchlist:[
				{
					id: '1',
					chg24h: '2.33',
					price: '275.71',
					volume24h: '13123743437.43',
					marketCap24h: '1233453.45',
					symbol: 'TSLA',
					domain: 'Tesla, Inc.',
					listingDate: new Date('2025-01-24').toString(),
					chg1h: '-5',
					chg7d: '25',
				},
				{
					id: '2',
					chg24h: '2.33',
					price: '0.24743',
					volume24h: '13123743437.43',
					marketCap24h: '1233453.45',
					symbol: 'NOIMG',
					domain: 'No Image',
					listingDate: new Date('2025-01-24').toString(),
					chg1h: '-5',
					chg7d: '25',
				},
			],
		},
		{
			id: '3',
			name: 'Forex',
			type: MarketType.Forex,
			isOpen: true,
			watchlist: [
				{
					id: '1',
					chg24h: '2.33',
					price: '275.71',
					volume24h: '13123743437.43',
					marketCap24h: '1233453.45',
					symbol: 'EUR',
					domain: 'USD',
					listingDate: new Date('2025-01-24').toString(),
					chg1h: '-5',
					chg7d: '25',
				},
				{
					id: '2',
					chg24h: '2.33',
					price: '275.71',
					volume24h: '13123743437.43',
					marketCap24h: '1233453.45',
					symbol: 'NO',
					domain: 'IMG',
					listingDate: new Date('2025-01-24').toString(),
					chg1h: '-5',
					chg7d: '25',
				},
			],
		},
		{
			id: '4',
			name: 'Commodity',
			type: MarketType.Commodity,
			isOpen: true,
			watchlist: [
				{
					id: '1',
					chg24h: '2.33',
					price: '275.71',
					volume24h: '13123743437.43',
					marketCap24h: '1233453.45',
					symbol: 'GC',
					domain: 'Gold Futures',
					listingDate: new Date('2025-01-24').toString(),
					chg1h: '-5',
					chg7d: '25',
				},
			],
		},
		{
			id: '5',
			name: 'Index',
			type: MarketType.Index,
			isOpen: true,
			watchlist: [
				{
					id: '1',
					chg24h: '2.33',
					price: '275.71',
					volume24h: '13123743437.43',
					marketCap24h: '1233453.45',
					symbol: 'NSE',
					domain: 'Nifty 50',
					listingDate: new Date('2025-01-24').toString(),
					chg1h: '-5',
					chg7d: '25',
				},
				{
					id: '2',
					chg24h: '2.33',
					price: '275.71',
					volume24h: '13123743437.43',
					marketCap24h: '1233453.45',
					symbol: 'FINRA',
					domain: 'DFS short',
					listingDate: new Date('2025-01-24').toString(),
					chg1h: '-5',
					chg7d: '25',
				},
			],
		},
	];

	const response: IGetWatchlistResponse = {
		data: mockData,
	};

	return response;
}

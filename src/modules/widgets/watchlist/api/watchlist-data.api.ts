import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { MarketType, type IWatchlistTable, type IWatchlistColumn, type IWatchlistTickerState } from '../model';
import { getImagePath, removeUndefinedPropertiesFromObject } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';
import { useWatchlistTabsStore } from '../stores';

const IS_USE_MOCK = true;

export interface IGetWatchlistRequest {
	tabId: string;
}

export interface IGetWatchlistResponse {
	data: IWatchlistTable;
}

export async function getWatchlistSections(args: IGetWatchlistRequest): Promise<IWatchlistTable> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = removeUndefinedPropertiesFromObject(args);

	try {
		const response = IS_USE_MOCK
			? await getMockData(args.tabId)
			: await httpService.get<IGetWatchlistResponse>('/api/watchlist', {
				query,
			});

		return prepareResponse(response.data);
	} catch (error) {
		logger.error('Failed to get watchlist', error as Error);
		throw error;
	}
}

function prepareResponse(data: IWatchlistTable): IWatchlistTable {
	return {
		...data,
		sections: data.sections.map(sectionItem => ({
			...sectionItem,
			rows: sectionItem.rows.map(marketItem => ({
				...marketItem,
				srcValue: getImagePath(marketItem.symbol, ImageTypePath.Currency),
				srcValue2: sectionItem.type === MarketType.Forex && marketItem.domain
					? getImagePath(marketItem.domain, ImageTypePath.Currency)
					: '',
			})),
		})),
	};
}

async function getMockData(tabId?: string): Promise<IGetWatchlistResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 200);
	});

	const tabsStore = useWatchlistTabsStore();

	// Mock columns configuration
	const mockColumns: IWatchlistColumn[] = [
		{ id: 'symbol', columnType: 'symbol', isShow: true, order: 1, width: 120 },
		{ id: 'price', columnType: 'price', isShow: true, order: 2, width: 100 },
		{ id: 'chg24h', columnType: 'chg24h', isShow: true, order: 3, width: 80 },
		{ id: 'volume24h', columnType: 'volume24h', isShow: true, order: 4, width: 120 },
		{ id: 'marketCap24h', columnType: 'marketCap24h', isShow: true, order: 5, width: 120 },
	];

	// Mock ticker state
	const mockTickerState: IWatchlistTickerState = {
		isShowLogo: true,
		isShowTicker: true,
		isShowDescription: true,
	};

	const mockTable1: IWatchlistTable = {
		id: '1',
		columns: mockColumns,
		tickerState: mockTickerState,
		sections: [
			{
				id: '1',
				name: 'Crypto',
				order: 1,
				type: MarketType.Crypto,
				isOpen: true,
				totalCount: 3,
				rows:[
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
				order: 2,
				type: MarketType.Stock,
				isOpen: true,
				totalCount: 2,
				rows:[
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
				order: 3,
				type: MarketType.Forex,
				isOpen: true,
				totalCount: 2,
				rows: [
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
				order: 4,
				type: MarketType.Commodity,
				isOpen: true,
				totalCount: 1,
				rows: [
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
				order: 5,
				type: MarketType.Index,
				isOpen: true,
				totalCount: 2,
				rows: [
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
		],
	};

	const mockTable2: IWatchlistTable = {
		id: '2',
		columns: mockColumns,
		tickerState: mockTickerState,
		sections: [
			{
				id: '3',
				name: 'Forex',
				order: 1,
				type: MarketType.Forex,
				isOpen: true,
				totalCount: 2,
				rows: [
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
				order: 2,
				type: MarketType.Commodity,
				isOpen: true,
				totalCount: 1,
				rows: [
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
				order: 3,
				type: MarketType.Index,
				isOpen: true,
				totalCount: 2,
				rows: [
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
		],
	};


	const mockTable3: IWatchlistTable =
		{
			id: '3',
			columns: mockColumns,
			tickerState: mockTickerState,
			sections: [],
		};

	const mockTables = [mockTable1, mockTable2, mockTable3];

	// eslint-disable-next-line prefer-destructuring
	let selectedData: IWatchlistTable = mockTables[2];

	tabsStore.tabs.forEach((tab, idx) => {
		if (idx <= 2 && tabId === tab.id) {
			selectedData = mockTables[idx];
		}
	});

	const response: IGetWatchlistResponse = {
		data: selectedData,
	};
	return response;
}

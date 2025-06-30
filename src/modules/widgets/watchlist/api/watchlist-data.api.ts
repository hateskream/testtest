import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import {
	MarketType,
	type IWatchlistTable,
	type IWatchlistColumn,
	type IWatchlistTickerState,
} from '../model';
import { getImagePath, removeUndefinedPropertiesFromObject } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';
import { useWatchlistTabsStore } from '../stores';
import { ColumnType } from '../const';

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
			: await httpService.get<IGetWatchlistResponse>('/api/watchlist/', {
				query,
			});

		return response.data;
	} catch (error) {
		logger.error('Failed to get watchlist', error as Error);
		throw error;
	}
}

async function getMockData(tabId?: string): Promise<IGetWatchlistResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 200);
	});

	const tabsStore = useWatchlistTabsStore();

	// Mock columns configuration
	const mockColumns: IWatchlistColumn[] = [
		{ id: '1', columnType: ColumnType.SYMBOL, isShow: true, order: 1 },
		{ id: '2', columnType: ColumnType.PRICE, isShow: true, order: 2 },
		{ id: '3', columnType: ColumnType.CHG24H, isShow: true, order: 3 },
		{ id: '7', columnType: ColumnType.CHG1H, isShow: true, order: 4 },
		{ id: '8', columnType: ColumnType.CHG7D, isShow: true, order: 5 },
		{ id: '4', columnType: ColumnType.VOLUME24H, isShow: true, order: 6 },
		{ id: '5', columnType: ColumnType.MARKET_CAP24H, isShow: true, order: 7 },
		{ id: '6', columnType: ColumnType.LISTING_DATE, isShow: true, order: 8, width: 80 },
		{ id: '9', columnType: ColumnType.CHART24H, isShow: true, order: 9 },
		{ id: '10', columnType: ColumnType.CHART7D, isShow: true, order: 10 },
		{ id: '11', columnType: ColumnType.CHART30D, isShow: true, order: 11 },
		{ id: '12', columnType: ColumnType.RANGE1Y, isShow: true, order: 12 },
		{ id: '13', columnType: ColumnType.LAST_DIVIDEND, isShow: true, order: 13 },
		{ id: '14', columnType: ColumnType.EMPLOYEES, isShow: true, order: 14 },
		{ id: '15', columnType: ColumnType.IPO_DATE, isShow: true, order: 15 },
		{ id: '16', columnType: ColumnType.SECTOR, isShow: true, order: 16 },
		{ id: '17', columnType: ColumnType.INDUSTRY, isShow: true, order: 17 },
		{ id: '18', columnType: ColumnType.SOURCE, isShow: true, order: 18 },
		{ id: '19', columnType: ColumnType.LISTING_DATE, isShow: true, order: 19 },
		{ id: '20', columnType: ColumnType.UPDATE_DATE, isShow: true, order: 20 },
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
				rows: [
					{
						tickerID: 'ADA-USD',
						symbol: {
							symbolType: 'Crypto',
							srcImg: getImagePath('ADA', ImageTypePath.Currency),
							ticker: 'ADA',
							blockchain: 'Cardano',
						},
						priceCurrent: {
							value: '137.4',
							currencySymbol: '$',
							trend: 'neutral',
						},
						changePrice24hPercent: {
							value: '0.00',
							trend: 'neutral',
						},
						volume24h: {
							value: '11723737.43',
							currencySymbol: '$',
							magnitude: 'M',
						},
						marketCap24h: {
							value: '22737283.45',
							currencySymbol: '$',
							magnitude: 'M',
						},
						changePrice1hPercent: {
							value: '12.00',
							trend: 'up',
						},
						changePrice7dPercent: {
							value: '15.00',
							trend: 'up',
						},
						changePrice24h: {
							value: '0.00',
							currencySymbol: '$',
						},
						priceMin24h: {
							value: '135.2',
							currencySymbol: '$',
						},
						priceMax24h: {
							value: '139.8',
							currencySymbol: '$',
						},
						priceMin1y: {
							value: '85.4',
							currencySymbol: '$',
						},
						priceMax1y: {
							value: '245.7',
							currencySymbol: '$',
						},
						priceAvg50d: {
							value: '142.3',
							currencySymbol: '$',
						},
						priceAvg200d: {
							value: '128.9',
							currencySymbol: '$',
						},
						volumeRel10d: {
							value: '1.2',
						},
						volumeAvg10d: {
							value: '9823456.78',
							currencySymbol: '$',
							magnitude: 'M',
						},
						rsiNumber: {
							value: '65.4',
						},
						beta5y: {
							value: '1.25',
						},
						openPrice: {
							value: '136.8',
							currencySymbol: '$',
						},
						closePrice: {
							value: '137.4',
							currencySymbol: '$',
						},
						changePrice30dPercent: {
							value: '8.50',
							trend: 'up',
						},
						price1yRange: {
							currencySymbol: '$',
							startValue: '85.4',
							endValue: '245.7',
						},
						price24hChart: {
							src: '/path/to/chart/ADA-24h.svg',
						},
						price7dChart: {
							src: '/path/to/chart/ADA-7d.svg',
						},
						price30dChart: {
							src: '/path/to/chart/ADA-30d.svg',
						},
						rsiChart: {
							src: '/path/to/chart/ADA-rsi.svg',
						},
						lastDividend: {
							value: 'N/A',
						},
						companyEmployees: {
							value: 'N/A',
						},
						companyIpoDate: {
							value: 'N/A',
						},
						companySector: {
							value: 'Cryptocurrency',
						},
						companyIndustry: {
							value: 'Blockchain',
						},
						source: {
							value: 'Binance',
						},
						listingDate: {
							value: new Date('2024-04-30').toDateString(),
						},
						updateDate: {
							value: new Date().toDateString(),
						},
					},
					{
						tickerID: 'BNB-USD',
						symbol: {
							symbolType: 'Crypto',
							srcImg: getImagePath('BNB', ImageTypePath.Currency),
							ticker: 'BNB',
							blockchain: 'Binance Smart Chain',
						},
						priceCurrent: {
							value: '635.4',
							currencySymbol: '$',
							trend: 'down',
						},
						changePrice24hPercent: {
							value: '-2.93',
							trend: 'down',
						},
						volume24h: {
							value: '323737.43',
							currencySymbol: '$',
							magnitude: 'K',
						},
						marketCap24h: {
							value: '37283.45',
							currencySymbol: '$',
							magnitude: 'K',
						},
						changePrice1hPercent: {
							value: '32.00',
							trend: 'up',
						},
						changePrice7dPercent: {
							value: '-42.00',
							trend: 'down',
						},
						changePrice24h: {
							value: '-19.17',
							currencySymbol: '$',
						},
						priceMin24h: {
							value: '630.2',
							currencySymbol: '$',
						},
						priceMax24h: {
							value: '654.6',
							currencySymbol: '$',
						},
						priceMin1y: {
							value: '420.3',
							currencySymbol: '$',
						},
						priceMax1y: {
							value: '720.8',
							currencySymbol: '$',
						},
						priceAvg50d: {
							value: '598.7',
							currencySymbol: '$',
						},
						priceAvg200d: {
							value: '565.4',
							currencySymbol: '$',
						},
						volumeRel10d: {
							value: '0.8',
						},
						volumeAvg10d: {
							value: '404671.79',
							currencySymbol: '$',
							magnitude: 'K',
						},
						rsiNumber: {
							value: '42.1',
						},
						beta5y: {
							value: '1.85',
						},
						openPrice: {
							value: '654.57',
							currencySymbol: '$',
						},
						closePrice: {
							value: '635.4',
							currencySymbol: '$',
						},
						changePrice30dPercent: {
							value: '-12.30',
							trend: 'down',
						},
						price1yRange: {
							currencySymbol: '$',
							startValue: '420.3',
							endValue: '720.8',
						},
						price24hChart: {
							src: '/path/to/chart/BNB-24h.svg',
						},
						price7dChart: {
							src: '/path/to/chart/BNB-7d.svg',
						},
						price30dChart: {
							src: '/path/to/chart/BNB-30d.svg',
						},
						rsiChart: {
							src: '/path/to/chart/BNB-rsi.svg',
						},
						lastDividend: {
							value: 'N/A',
						},
						companyEmployees: {
							value: 'N/A',
						},
						companyIpoDate: {
							value: 'N/A',
						},
						companySector: {
							value: 'Cryptocurrency',
						},
						companyIndustry: {
							value: 'Exchange Token',
						},
						source: {
							value: 'Binance',
						},
						listingDate: {
							value: new Date('2025-04-12').toDateString(),
						},
						updateDate: {
							value: new Date().toDateString(),
						},
					},
				],
			},
			{
				id: '2',
				name: 'Stocks',
				order: 2,
				type: MarketType.Stock,
				isOpen: true,
				totalCount: 1,
				rows: [
					{
						tickerID: 'TSLA',
						symbol: {
							symbolType: 'Stock',
							srcImg: getImagePath('TSLA', ImageTypePath.Stock),
							ticker: 'TSLA',
							companyName: 'Tesla, Inc.',
						},
						priceCurrent: {
							value: '275.71',
							currencySymbol: '$',
							trend: 'up',
						},
						changePrice24hPercent: {
							value: '2.33',
							trend: 'up',
						},
						volume24h: {
							value: '13123743437.43',
							currencySymbol: '$',
							magnitude: 'B',
						},
						marketCap24h: {
							value: '1233453.45',
							currencySymbol: '$',
							magnitude: 'B',
						},
						changePrice1hPercent: {
							value: '-5.00',
							trend: 'down',
						},
						changePrice7dPercent: {
							value: '25.00',
							trend: 'up',
						},
						changePrice24h: {
							value: '6.27',
							currencySymbol: '$',
						},
						priceMin24h: {
							value: '269.44',
							currencySymbol: '$',
						},
						priceMax24h: {
							value: '278.85',
							currencySymbol: '$',
						},
						priceMin1y: {
							value: '138.80',
							currencySymbol: '$',
						},
						priceMax1y: {
							value: '414.50',
							currencySymbol: '$',
						},
						priceAvg50d: {
							value: '245.67',
							currencySymbol: '$',
						},
						priceAvg200d: {
							value: '203.45',
							currencySymbol: '$',
						},
						volumeRel10d: {
							value: '1.5',
						},
						volumeAvg10d: {
							value: '8748582291.62',
							currencySymbol: '$',
							magnitude: 'B',
						},
						rsiNumber: {
							value: '58.7',
						},
						beta5y: {
							value: '2.31',
						},
						openPrice: {
							value: '269.44',
							currencySymbol: '$',
						},
						closePrice: {
							value: '275.71',
							currencySymbol: '$',
						},
						changePrice30dPercent: {
							value: '18.75',
							trend: 'up',
						},
						price1yRange: {
							currencySymbol: '$',
							startValue: '138.80',
							endValue: '414.50',
						},
						price24hChart: {
							src: '/path/to/chart/TSLA-24h.svg',
						},
						price7dChart: {
							src: '/path/to/chart/TSLA-7d.svg',
						},
						price30dChart: {
							src: '/path/to/chart/TSLA-30d.svg',
						},
						rsiChart: {
							src: '/path/to/chart/TSLA-rsi.svg',
						},
						lastDividend: {
							value: '$0.00',
						},
						companyEmployees: {
							value: '140,473',
						},
						companyIpoDate: {
							value: '2010-06-29',
						},
						companySector: {
							value: 'Consumer Cyclical',
						},
						companyIndustry: {
							value: 'Auto Manufacturers',
						},
						source: {
							value: 'NASDAQ',
						},
						listingDate: {
							value: new Date('2025-01-24').toDateString(),
						},
						updateDate: {
							value: new Date().toDateString(),
						},
					},
				],
			},
			{
				id: '3',
				name: 'Forex',
				order: 3,
				type: MarketType.Forex,
				isOpen: true,
				totalCount: 1,
				rows: [
					{
						tickerID: 'EURUSD',
						symbol: {
							symbolType: 'Forex',
							leftSrcImg: getImagePath('EUR', ImageTypePath.Currency),
							rightSrcImg: getImagePath('USD', ImageTypePath.Currency),
							leftTicker: 'EUR',
							rightTicker: 'USD',
						},
						priceCurrent: {
							value: '1.0875',
							trend: 'up',
						},
						changePrice24hPercent: {
							value: '0.45',
							trend: 'up',
						},
						volume24h: {
							value: '45623847291.43',
							currencySymbol: '$',
							magnitude: 'B',
						},
						marketCap24h: {
							value: 'N/A',
						},
						changePrice1hPercent: {
							value: '0.12',
							trend: 'up',
						},
						changePrice7dPercent: {
							value: '-1.25',
							trend: 'down',
						},
						changePrice24h: {
							value: '0.0049',
						},
						priceMin24h: {
							value: '1.0826',
						},
						priceMax24h: {
							value: '1.0889',
						},
						priceMin1y: {
							value: '1.0448',
						},
						priceMax1y: {
							value: '1.1274',
						},
						priceAvg50d: {
							value: '1.0756',
						},
						priceAvg200d: {
							value: '1.0687',
						},
						volumeRel10d: {
							value: '1.1',
						},
						volumeAvg10d: {
							value: '41476225719.48',
							currencySymbol: '$',
							magnitude: 'B',
						},
						rsiNumber: {
							value: '62.3',
						},
						beta5y: {
							value: 'N/A',
						},
						openPrice: {
							value: '1.0830',
						},
						closePrice: {
							value: '1.0875',
						},
						changePrice30dPercent: {
							value: '2.15',
							trend: 'up',
						},
						price1yRange: {
							startValue: '1.0448',
							endValue: '1.1274',
						},
						price24hChart: {
							src: '/path/to/chart/EURUSD-24h.svg',
						},
						price7dChart: {
							src: '/path/to/chart/EURUSD-7d.svg',
						},
						price30dChart: {
							src: '/path/to/chart/EURUSD-30d.svg',
						},
						rsiChart: {
							src: '/path/to/chart/EURUSD-rsi.svg',
						},
						lastDividend: {
							value: 'N/A',
						},
						companyEmployees: {
							value: 'N/A',
						},
						companyIpoDate: {
							value: 'N/A',
						},
						companySector: {
							value: 'Currency',
						},
						companyIndustry: {
							value: 'Foreign Exchange',
						},
						source: {
							value: 'Forex.com',
						},
						listingDate: {
							value: new Date('2025-01-24').toDateString(),
						},
						updateDate: {
							value: new Date().toDateString(),
						},
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
				id: '4',
				name: 'Commodity',
				order: 1,
				type: MarketType.Commodity,
				isOpen: true,
				totalCount: 1,
				rows: [
					{
						tickerID: 'GC=F',
						symbol: {
							symbolType: 'Commodity',
							srcImg: getImagePath('GC', ImageTypePath.Stock),
							ticker: 'GC',
							commodityName: 'Gold Futures',
						},
						priceCurrent: {
							value: '2045.70',
							currencySymbol: '$',
							trend: 'up',
						},
						changePrice24hPercent: {
							value: '1.25',
							trend: 'up',
						},
						volume24h: {
							value: '2847291634.43',
							currencySymbol: '$',
							magnitude: 'B',
						},
						marketCap24h: {
							value: 'N/A',
						},
						changePrice1hPercent: {
							value: '0.35',
							trend: 'up',
						},
						changePrice7dPercent: {
							value: '3.80',
							trend: 'up',
						},
						changePrice24h: {
							value: '25.30',
							currencySymbol: '$',
						},
						priceMin24h: {
							value: '2020.40',
							currencySymbol: '$',
						},
						priceMax24h: {
							value: '2048.90',
							currencySymbol: '$',
						},
						priceMin1y: {
							value: '1810.20',
							currencySymbol: '$',
						},
						priceMax1y: {
							value: '2135.40',
							currencySymbol: '$',
						},
						priceAvg50d: {
							value: '1987.60',
							currencySymbol: '$',
						},
						priceAvg200d: {
							value: '1943.80',
							currencySymbol: '$',
						},
						volumeRel10d: {
							value: '1.3',
						},
						volumeAvg10d: {
							value: '2189454333.02',
							currencySymbol: '$',
							magnitude: 'B',
						},
						rsiNumber: {
							value: '71.5',
						},
						beta5y: {
							value: 'N/A',
						},
						openPrice: {
							value: '2020.40',
							currencySymbol: '$',
						},
						closePrice: {
							value: '2045.70',
							currencySymbol: '$',
						},
						changePrice30dPercent: {
							value: '7.20',
							trend: 'up',
						},
						price1yRange: {
							currencySymbol: '$',
							startValue: '1810.20',
							endValue: '2135.40',
						},
						price24hChart: {
							src: '/path/to/chart/GC-24h.svg',
						},
						price7dChart: {
							src: '/path/to/chart/GC-7d.svg',
						},
						price30dChart: {
							src: '/path/to/chart/GC-30d.svg',
						},
						rsiChart: {
							src: '/path/to/chart/GC-rsi.svg',
						},
						lastDividend: {
							value: 'N/A',
						},
						companyEmployees: {
							value: 'N/A',
						},
						companyIpoDate: {
							value: 'N/A',
						},
						companySector: {
							value: 'Commodities',
						},
						companyIndustry: {
							value: 'Precious Metals',
						},
						source: {
							value: 'COMEX',
						},
						listingDate: {
							value: new Date('2025-01-24').toDateString(),
						},
						updateDate: {
							value: new Date().toDateString(),
						},
					},
				],
			},
		],
	};

	const mockTable3: IWatchlistTable = {
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

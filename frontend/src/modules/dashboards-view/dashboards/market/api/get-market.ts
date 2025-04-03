import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import type { IMarket } from '../model';
import { removeUndefinedPropertiesFromObject } from '@/shared/lib';

const IS_USE_MOCK = true;

export interface IGetMarketRequest {
	market: string;
	sort?: string;
	timeframe?: string;
}

export interface IGetMarketResponse {
	data: IMarket[];
}

export async function getMarket(args: IGetMarketRequest): Promise<IMarket[]> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = removeUndefinedPropertiesFromObject(args);

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IGetMarketResponse>('/api/market', {
					query,
				});

		return response.data;
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}

export async function getMockData(): Promise<IGetMarketResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const mockData: IMarket[] = [
		{
			chg24h: '0',
			price: '137.4',
			volume24h: '11723737.43',
			marketCap24h: '22737283.45',
			symbol: 'ADA',
			listingDate: new Date('2024-04-30').toString(),
			chg1h: '12',
			chg7d: '15',
		},
		{
			chg24h: '-2.93',
			price: '635.4',
			volume24h: '323737.43',
			marketCap24h: '37283.45',
			symbol: 'BNB',
			listingDate: new Date('2025-04-12').toString(),
			chg1h: '32',
			chg7d: '-42',
		},
		{
			chg24h: '0.86',
			price: '97432.7',
			volume24h: '32374523437.43',
			marketCap24h: '372853453.45',
			symbol: 'BTC',
			listingDate: new Date('2023-06-15').toString(),
			chg1h: '-12',
			chg7d: '49',
		},
		{
			chg24h: '2.33',
			price: '0.24743',
			volume24h: '13123743437.43',
			marketCap24h: '1233453.45',
			symbol: 'TRON',
			listingDate: new Date('2025-01-24').toString(),
			chg1h: '-5',
			chg7d: '25',
		},
	];

	const response: IGetMarketResponse = {
		data: mockData,
	};

	return response;
}

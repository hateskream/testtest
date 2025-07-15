import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { getImagePath, removeUndefinedPropertiesFromObject } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';
import type { IMarketCapCurrency } from '../model/market-cap';

const IS_USE_MOCK = true;

export interface IGetMarketCapRequest {
	market: string;
}

export interface IGetMarketResponse {
	data: IMarketCapCurrency[];
}

export interface IMarketCapDomain extends IMarketCapCurrency {
	srcValue: string;
}

export async function getMarketCap(args: IGetMarketCapRequest): Promise<IMarketCapDomain[]> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = removeUndefinedPropertiesFromObject(args);

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IGetMarketResponse>('/api/market', {
				query,
			});

		return prepareResponse(response.data);
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}

function prepareResponse(data: IMarketCapCurrency[]): IMarketCapDomain[] {
	return data.map(item => ({
		...item,
		srcValue: getImagePath(item.symbol, item.type === 'crypto' ? ImageTypePath.Currency : ImageTypePath.Stock),
	}));
}

export async function getMockData(): Promise<IGetMarketResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const mockData: IMarketCapCurrency[] = [
		{
			id: '1',
			symbol: 'ADA',
			name: 'Cardano',
			type: 'crypto',
		},
		{
			id: '2',
			symbol: 'TRON',
			name: 'TRX',
			type: 'crypto',
		},
		{
			id: '3',
			symbol: 'SOL',
			name: 'Solana',
			type: 'crypto',
		},
		{
			id: '4',
			symbol: 'TSLA',
			name: 'Tesla Inc',
			type: 'stock',
		},
	];

	const response: IGetMarketResponse = {
		data: mockData,
	};

	return response;
}

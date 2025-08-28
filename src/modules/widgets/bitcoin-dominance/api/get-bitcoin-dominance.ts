import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { getImagePath, removeUndefinedPropertiesFromObject } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';
import type { IBitcoinDominanceCurrency } from '../model/bitcoin-dominance';

const IS_USE_MOCK = true;

export interface IGetBitcoinDominanceRequest {
	market: string;
}

export interface IGetDominanceResponse {
	data: IBitcoinDominanceCurrency[];
}

export interface IBitcoinDominanceDomain extends IBitcoinDominanceCurrency {
	srcValue: string;
}

export async function getBitcoinDominance(args: IGetBitcoinDominanceRequest): Promise<IBitcoinDominanceDomain[]> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = removeUndefinedPropertiesFromObject(args);

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IGetDominanceResponse>('/api/market', {
				query,
			});

		return prepareResponse(response.data);
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}

function prepareResponse(data: IBitcoinDominanceCurrency[]): IBitcoinDominanceDomain[] {
	return data.map(item => ({
		...item,
		srcValue: getImagePath(item.symbol, item.type === 'crypto' ? ImageTypePath.Currency : ImageTypePath.Stock),
	}));
}

export async function getMockData(): Promise<IGetDominanceResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const mockData: IBitcoinDominanceCurrency[] = [
		{
			id: '1',
			symbol: 'BTC',
			name: 'Bitcoin',
			type: 'crypto',
			changeYerstaday: 35,
			changeWeek: 10,
			changeYear: -5,
			color: ' rgb(247, 169, 104)',
			dominance: 65,
		},
		{
			id: '2',
			symbol: 'ADA',
			name: 'Cardano',
			type: 'crypto',
			changeYerstaday: 35,
			changeWeek: 10,
			changeYear: -5,
			color: ' rgba(30, 75, 173, 1)',
			dominance: 4,
		},
		{
			id: '3',
			symbol: 'TRON',
			name: 'TRX',
			type: 'crypto',
			changeYerstaday: 50,
			changeWeek: 20,
			changeYear: 10,
			color: ' rgb(42, 135, 211)',
			dominance: 6,
		},
		{
			id: '4',
			symbol: 'SOL',
			name: 'Solana',
			type: 'crypto',
			changeYerstaday: -4,
			changeWeek: 25,
			changeYear: 30,
			color: ' rgb(42, 211, 98)',
			dominance: 9.86,
		},
		{
			id: '5',
			symbol: 'TSLA',
			name: 'Tesla Inc',
			type: 'stock',
			changeYerstaday: -2,
			changeWeek: -5,
			changeYear: 15,
			color: ' rgb(211, 67, 42)',
			dominance: 6.7,
		},
	];

	const response: IGetDominanceResponse = {
		data: mockData,
	};

	return response;
}

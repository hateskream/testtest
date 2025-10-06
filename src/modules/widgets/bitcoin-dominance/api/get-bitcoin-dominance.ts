import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { getImagePath, removeUndefinedPropertiesFromObject } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';
import type { IBitcoinDominanceCurrency } from '../model/bitcoin-dominance';
import { useFetchMock } from '@/shared/mock';

const IS_USE_MOCK = true;

export interface IGetBitcoinDominanceRequest {
	tickersIds: string;
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
			? await getMockData(args)
			: await httpService.get<IGetDominanceResponse>('/api/market', {
				query,
			});

		// console.log('response', response);

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

const { getMock } = useFetchMock<IBitcoinDominanceCurrency[]>('/mock/widgets/bitcoin-dominance.json');

export async function getMockData(args: IGetBitcoinDominanceRequest): Promise<IGetDominanceResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const mockData = await getMock();

	const response: IGetDominanceResponse = {
		data: mockData.filter(item => args.tickersIds.includes(item.id)),
	};

	return response;
}

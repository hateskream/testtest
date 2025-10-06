import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { getImagePath, removeUndefinedPropertiesFromObject } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';
import type { IMarketCapCurrency } from '../model/market-cap';
import { useFetchMock } from '@/shared/mock';

const IS_USE_MOCK = true;

export interface IGetMarketCapRequest {
	tickersIds: string;
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
			? await getMockData(args)
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

const { getMock } = useFetchMock<IMarketCapCurrency[]>('/mock/widgets/market-cap.json');

async function getMockData(args: IGetMarketCapRequest): Promise<IGetMarketResponse> {
	const mockData = await getMock();

	const response: IGetMarketResponse = {
		data: mockData.filter(item => args.tickersIds.includes(item.id)),
	};

	return response;
}

import { useHttpService } from '@/shared/service/http-service';
import { type ICurrency as ICurrencyDomain } from '../model';
import { useLogger } from '@/shared/service/logger';
import { getCurrencyImage } from '@/shared/lib';

enum TypeSendRequest {
	Prod,
	MockLocal,
	MockServer,
}

const typeSendRequest = TypeSendRequest.MockServer;

export interface IGetPriceRequest {
	market: string;
}

interface ICurrency {
	name: string;
	ticker: string;
	price: string;
	changeLastDay: string;
	marketCap: string;
}

export interface IGetPriceResponse {
	data: ICurrency[];
}

export async function getPrice({ market }: IGetPriceRequest): Promise<ICurrencyDomain[] | null> {
	const logger = useLogger();

	try {
		const response = await sendereRequestByType(typeSendRequest, { market });

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get price', error as Error);
		throw error;
	}
}

function sendereRequestByType(
	type: TypeSendRequest,
	{ market }: IGetPriceRequest,
): Promise<IGetPriceResponse> {
	const httpService = useHttpService();

	switch (type) {
		case TypeSendRequest.Prod:
			return httpService.get<IGetPriceResponse>('/api/price1', {
				query: { market },
			});
		case TypeSendRequest.MockLocal:
			return getMockData();
		case TypeSendRequest.MockServer:
			return httpService.get<IGetPriceResponse>('/api/price');
		default:
			return getMockData();
	}
}

function prepareResponse(response: IGetPriceResponse): ICurrencyDomain[] {
	console.log('response', response);
	return response.data.map(currency => ({
		...currency,
		srcImage: getCurrencyImage(currency.ticker),
	}));
}

async function getMockData(): Promise<IGetPriceResponse> {
	const mockData: ICurrency[] = [
		{
			ticker: 'BTC',
			name: 'Bitcoin',
			price: '$86,945.83',
			changeLastDay: '1.54%',
			marketCap: '$3.20T',
		},
		{
			ticker: 'ADA',
			name: 'Cardano',
			price: '$2,166.88',
			changeLastDay: '2.34%',
			marketCap: '$3.20T',
		},
		{
			ticker: 'BNB',
			name: 'BNB',
			price: '$583.99',
			changeLastDay: '2.23%',
			marketCap: '$3.20T',
		},
		{
			ticker: 'SOL',
			name: 'Solana',
			price: '$143.08',
			changeLastDay: '1.31%',
			marketCap: '$3.20T',
		},
		{
			ticker: 'TRON',
			name: 'Tron',
			price: '$2.4552',
			changeLastDay: '4.73%',
			marketCap: '$3.20T',
		},
		{
			ticker: '2TRON',
			name: 'Tron',
			price: '$2.4552',
			changeLastDay: '4.73%',
			marketCap: '$3.20T',
		},
		{
			ticker: 'TR4ON',
			name: 'Tron',
			price: '$2.4552',
			changeLastDay: '4.73%',
			marketCap: '$3.20T',
		},
	];

	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const response: IGetPriceResponse = {
		data: mockData,
	};

	return response;
}

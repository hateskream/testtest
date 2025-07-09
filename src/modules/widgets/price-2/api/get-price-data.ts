import { useHttpService } from '@/shared/service/http-service';
import { type ICurrency as ICurrencyDomain } from '../model';
import { useLogger } from '@/shared/service/logger';
import { getImagePath } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path';

enum TypeSendRequest {
	Prod,
	MockLocal,
	MockServer,
}

const typeSendRequest = TypeSendRequest.MockLocal;

export interface IGetPriceRequest {
	market: string;
}

interface ICurrency {
	name: string;
	ticker: string;
	price: string;
	changeLastDay: string;
	marketCap: string;
	market: string;
	domain?: string;
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
			return httpService.get<IGetPriceResponse>('https://gateway.planet9.uk/price', {
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
	return response.data.map(currency => currency.market === 'forex' && currency.domain ? {
		...currency,
		srcImage: [
			getImagePath(currency.ticker, ImageTypePath.Currency),
			getImagePath(currency.domain, ImageTypePath.Currency),
		],
	} : {
		...currency,
		srcImage: getImagePath(currency.ticker, ImageTypePath.Currency),
	});
}

async function getMockData(): Promise<IGetPriceResponse> {
	const mockData: ICurrency[] = [
		{
			ticker: 'BTC',
			name: 'Bitcoin',
			price: '$86,945.83',
			changeLastDay: '1.54%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			ticker: 'ADA',
			name: 'Cardano',
			price: '$2,166.88',
			changeLastDay: '2.34%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		// {
		// 	ticker: 'EUR',
		// 	name: 'EUR',
		// 	price: '$1.03717',
		// 	changeLastDay: '-2.34%',
		// 	marketCap: '$29.3T',
		// 	market: 'forex',
		// 	domain: 'USD',
		// },
		{
			ticker: 'BNB',
			name: 'BNB',
			price: '$583.99',
			changeLastDay: '2.23%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			ticker: 'SOL',
			name: 'Solana',
			price: '$143.08',
			changeLastDay: '1.31%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			ticker: 'XAU',
			name: 'Gold',
			price: '$2,300.00',
			changeLastDay: '0.45%',
			marketCap: '$12.00T',
			market: 'commodities',
		},
		{
			ticker: 'XAG',
			name: 'Silver',
			price: '$29.00',
			changeLastDay: '1.10%',
			marketCap: '$1.30T',
			market: 'commodities',
		},
		{
			ticker: 'WTI',
			name: 'Crude Oil',
			price: '$75.00',
			changeLastDay: '-0.80%',
			marketCap: '$3.00T',
			market: 'commodities',
		},
		{
			ticker: '2TRONN',
			name: 'Tron',
			price: '$2.4552',
			changeLastDay: '4.73%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			ticker: 'AASDD',
			name: 'Tron',
			price: '$2.4552',
			changeLastDay: '4.73%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			ticker: 'STR4ON1',
			name: 'Tron',
			price: '$2.4552',
			changeLastDay: '4.73%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			ticker: 'DTR4ON2',
			name: 'Tron',
			price: '$2.4552',
			changeLastDay: '4.73%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			ticker: 'ATR4ON3',
			name: 'Tron',
			price: '$2.4552',
			changeLastDay: '4.73%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			ticker: 'GTR4ON4',
			name: 'Tron',
			price: '$2.4552',
			changeLastDay: '4.73%',
			marketCap: '$3.20T',
			market: 'crypto',
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

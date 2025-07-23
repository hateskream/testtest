import { useHttpService } from '@/shared/service/http-service';
import { type ICurrency as ICurrencyDomain } from '../model';
import { useLogger } from '@/shared/service/logger';
import { generateTimestampId, getImagePath } from '@/shared/lib';
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
	id: string;
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

export async function getPrice(): Promise<ICurrencyDomain[] | null> {
	const logger = useLogger();

	try {
		const response = await senderRequestByType(typeSendRequest);

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get price', error as Error);
		throw error;
	}
}

function senderRequestByType(
	type: TypeSendRequest,
): Promise<IGetPriceResponse> {
	const httpService = useHttpService();

	switch (type) {
		case TypeSendRequest.Prod:
			return httpService.get<IGetPriceResponse>('https://gateway.planet9.uk/price');
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
			getImagePath(currency.ticker, ImageTypePath.Stock),
			getImagePath(currency.domain, ImageTypePath.Stock),
		],
	} : {
		...currency,
		srcImage: currency.market !== 'crypto' ?
			getImagePath(currency.ticker, ImageTypePath.Stock) :
			getImagePath(currency.ticker, ImageTypePath.Currency),
	});
}

async function getMockData(): Promise<IGetPriceResponse> {
	const allMockData: ICurrency[] = [
		{
			id: generateTimestampId(),
			ticker: 'BTC',
			name: 'Bitcoin',
			price: '$86,945.83',
			changeLastDay: '1.54%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			id: generateTimestampId(),
			ticker: 'ADA',
			name: 'Cardano',
			price: '$2,166.88',
			changeLastDay: '2.34%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			id: generateTimestampId(),
			ticker: 'BNB',
			name: 'BNB',
			price: '$583.99',
			changeLastDay: '2.23%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			id: generateTimestampId(),
			ticker: 'SOL',
			name: 'Solana',
			price: '$143.08',
			changeLastDay: '1.31%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			id: generateTimestampId(),
			ticker: 'ETH',
			name: 'Ethereum',
			price: '$3,245.67',
			changeLastDay: '2.87%',
			marketCap: '$3.90T',
			market: 'crypto',
		},
		{
			id: generateTimestampId(),
			ticker: 'TRX',
			name: 'Tron',
			price: '$2.4552',
			changeLastDay: '4.73%',
			marketCap: '$3.20T',
			market: 'crypto',
		},
		{
			id: generateTimestampId(),
			ticker: 'AAPL',
			name: 'Apple Inc.',
			price: '$185.92',
			changeLastDay: '1.23%',
			marketCap: '$2.89T',
			market: 'industry',
		},
		{
			id: generateTimestampId(),
			ticker: 'MSFT',
			name: 'Microsoft Corp.',
			price: '$342.15',
			changeLastDay: '0.87%',
			marketCap: '$2.54T',
			market: 'industry',
		},
		{
			id: generateTimestampId(),
			ticker: 'GOOGL',
			name: 'Alphabet Inc.',
			price: '$138.45',
			changeLastDay: '-0.45%',
			marketCap: '$1.75T',
			market: 'industry',
		},
		{
			id: generateTimestampId(),
			ticker: 'TSLA',
			name: 'Tesla Inc.',
			price: '$248.73',
			changeLastDay: '3.21%',
			marketCap: '$785B',
			market: 'industry',
		},
		{
			id: generateTimestampId(),
			ticker: 'NVDA',
			name: 'NVIDIA Corp.',
			price: '$875.34',
			changeLastDay: '2.14%',
			marketCap: '$2.15T',
			market: 'industry',
		},
		{
			id: generateTimestampId(),
			ticker: 'META',
			name: 'Meta Platforms',
			price: '$295.67',
			changeLastDay: '1.87%',
			marketCap: '$742B',
			market: 'industry',
		},
		{
			id: generateTimestampId(),
			ticker: 'XAU',
			name: 'Gold',
			price: '$2,300.00',
			changeLastDay: '0.45%',
			marketCap: '$12.00T',
			market: 'something',
		},
		{
			id: generateTimestampId(),
			ticker: 'XAG',
			name: 'Silver',
			price: '$29.00',
			changeLastDay: '1.10%',
			marketCap: '$1.30T',
			market: 'something',
		},
		{
			id: generateTimestampId(),
			ticker: 'WTI',
			name: 'Crude Oil',
			price: '$75.00',
			changeLastDay: '-0.80%',
			marketCap: '$3.00T',
			market: 'something',
		},
		{
			id: generateTimestampId(),
			ticker: 'EUR',
			name: 'EUR/USD',
			price: '$1.03717',
			changeLastDay: '-0.34%',
			marketCap: '$29.3T',
			market: 'something',
			domain: 'USD',
		},
		{
			id: generateTimestampId(),
			ticker: 'GBP',
			name: 'GBP/USD',
			price: '$1.26534',
			changeLastDay: '0.78%',
			marketCap: '$15.8T',
			market: 'something',
			domain: 'USD',
		},
		{
			id: generateTimestampId(),
			ticker: 'JPY',
			name: 'USD/JPY',
			price: '¥150.25',
			changeLastDay: '-0.12%',
			marketCap: '$18.2T',
			market: 'something',
			domain: 'USD',
		},
	];

	await new Promise(resolve => {
		setTimeout(resolve, 100); // Simulate network delay
	});

	const response: IGetPriceResponse = {
		data: allMockData,
	};

	return response;
}

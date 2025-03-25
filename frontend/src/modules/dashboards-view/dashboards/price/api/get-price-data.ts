import { useHttpService } from '@/shared/service/http-service';
import { type ICurrency as ICurrencyDomain } from '../model';
import { useLogger } from '@/shared/service/logger';
import { getCurrencyImage } from '@/shared/lib';

const IS_USE_MOCK = true;

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
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IGetPriceResponse>('/api/price', {
					query: { market },
				});

		return prepareResponse(response);
	} catch (error) {
		logger.error('Failed to get price', error as Error);
		throw error;
	}
}

function prepareResponse(response: IGetPriceResponse): ICurrencyDomain[] {
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
			ticker: 'ETH',
			name: 'Ethereum',
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
			ticker: 'XRP',
			name: 'XRP',
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

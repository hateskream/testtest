import { useHttpService } from '@/shared/service/http-service';
import type { IMarket } from '../model';

const IS_USE_MOCK = true;

export async function getMarket(): Promise<IMarket | null> {
	const httpService = useHttpService();

	try {
		const response = IS_USE_MOCK
			? await getMockData()
			: await httpService.get<IMarket>('/api/market', {
					// headers: { Authorization: `Bearer ${accessToken}` },
				});

		return response;
	} catch (error) {
		console.error(error);
	}

	return null;
}

export async function getMockData(): Promise<IMarket> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const response: IMarket = {
		list: [
			{
				chg24h: '0',
				price: '137.4',
				volume24h: '11723737.43',
				marketCap: '22737283.45',
				symbol: 'ADA',
			},
			{
				chg24h: '-2.93',
				price: '635.4',
				volume24h: '323737.43',
				marketCap: '37283.45',
				symbol: 'BNB',
			},
			{
				chg24h: '0.86',
				price: '97432.7',
				volume24h: '32374523437.43',
				marketCap: '372853453.45',
				symbol: 'BTC',
			},
			{
				chg24h: '2.33',
				price: '0.24743',
				volume24h: '13123743437.43',
				marketCap: '1233453.45',
				symbol: 'TRX',
			},
		],
	};

	return response;
}

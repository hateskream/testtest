import { useHttpService } from '@/shared/service/http-service';
import { type IAltcoinSeason, type IAltcoinSeasonRequest } from '../model';
import { useLogger } from '@/shared/service/logger';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}

const dataProvider = DataProvider.MockLocal;

export async function getAltcoinSeason({ market, period }: IAltcoinSeasonRequest): Promise<IAltcoinSeason[] | null> {
	const logger = useLogger();

	try {
		const response = await sendRequestByProvider(dataProvider, { market, period });

		return response;
	} catch (error) {
		logger.error('Failed to get altcoin season', error as Error);
		throw error;
	}
}

function sendRequestByProvider(
	type: DataProvider,
	{ market }: IAltcoinSeasonRequest,
): Promise<IAltcoinSeason[]> {
	const httpService = useHttpService();

	switch (type) {
		case DataProvider.Production:
			return httpService.get<IAltcoinSeason[]>('https://gateway.planet9.uk/altcoin-season', {
				query: { market },
			});
		case DataProvider.MockLocal:
			return getMockData();
		case DataProvider.MockServer:
			return httpService.get<IAltcoinSeason[]>('/api/altcoin-season');
		default:
			return getMockData();
	}
}

async function getMockData(): Promise<IAltcoinSeason[]> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const mockData: IAltcoinSeason[] = [
		{
			period: '90D',
			btcRank: 1,
			maxRank: 30,
		},
	];

	return mockData;
}

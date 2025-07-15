import { useHttpService } from '@/shared/service/http-service';
import { type IAltcoinSeasonConfig, type IAltcoinSeasonRequest } from '../model';
import { useLogger } from '@/shared/service/logger';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}

const dataProvider = DataProvider.MockLocal;

export async function getAltcoinSeasonWidgetConfig({ market }: IAltcoinSeasonRequest) {
	const logger = useLogger();

	try {
		const response = await sendRequestByProvider(dataProvider, { market });

		return response;
	} catch (error) {
		logger.error('Failed to get altcoin season widget config', error as Error);
		throw error;
	}
}

function sendRequestByProvider(type: DataProvider, { market }: IAltcoinSeasonRequest) {
	const httpService = useHttpService();

	switch (type) {
		case DataProvider.Production:
			return httpService.get<IAltcoinSeasonConfig>('https://gateway.planet9.uk/altcoin-season', {
				query: { market },
			});
		case DataProvider.MockLocal:
			return getMockData();
		case DataProvider.MockServer:
			return httpService.get<IAltcoinSeasonConfig>('/api/altcoin-season');
		default:
			return getMockData();
	}
}

async function getMockData() {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const mockData: IAltcoinSeasonConfig = {
		modules: {
			performanceRank: true,
			historicalValues: true,
			highLow: true,
			top100: true,
			chart: true,
		},
		period: '90D',
	};

	return mockData;
}

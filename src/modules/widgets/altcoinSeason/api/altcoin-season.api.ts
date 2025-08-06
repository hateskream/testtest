import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import type { IPerformanceRank, IHistoricalValue, Period, IAltcoinSeasonConfig } from '../model';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}
const dataProvider = DataProvider.MockLocal;


export interface IAltcoinSeasonRequest {
	market: string;
	period?: Period;
}


export interface IAltcoinSeasonDataResponse {
	widgetConfig: IAltcoinSeasonConfig;
	performanceRank: IPerformanceRank;
	historicalValues: IHistoricalValue;
	top100: unknown;
	chart: unknown;
}

export async function getAltcoinSeason({ market }: IAltcoinSeasonRequest): Promise<IAltcoinSeasonDataResponse> {
	const logger = useLogger();

	try {
		const response = await sendRequestByProvider(dataProvider, { market });

		return response;
	} catch (error) {
		logger.error('Failed to get altcoin season', error as Error);
		throw error;
	}
}

function sendRequestByProvider(
	type: DataProvider,
	{ market }: IAltcoinSeasonRequest,
): Promise<IAltcoinSeasonDataResponse> {
	const httpService = useHttpService();

	switch (type) {
		case DataProvider.Production:
			return httpService.get<IAltcoinSeasonDataResponse>('https://gateway.planet9.uk/altcoin-season', {
				query: { market },
			});
		case DataProvider.MockLocal:
			return getMockData();
		case DataProvider.MockServer:
			return httpService.get<IAltcoinSeasonDataResponse>('/api/altcoin-season');
		default:
			return getMockData();
	}
}

async function getMockData(): Promise<IAltcoinSeasonDataResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const widgetConfigMockData: IAltcoinSeasonConfig = {
		period: '90D',
		modules: {
			performanceRank: true,
			historicalValues: true,
			top100: true,
			chart: true,
		},
	};


	const btcRank = Math.floor(Math.random() * 30) + 1;

	const performanceRankMockData: IPerformanceRank =
		{
			btcRank: btcRank,
			maxRank: 30,
			period: '90D',
		};

	const historicalValuesMockData: IHistoricalValue = {
		today: btcRank,
		lastWeek: Math.floor(Math.random() * 30) + 1,
		lastMonth: Math.floor(Math.random() * 30) + 1,
	};


	const response: IAltcoinSeasonDataResponse = {
		widgetConfig: widgetConfigMockData,
		performanceRank: performanceRankMockData,
		historicalValues: historicalValuesMockData,
		top100: {}, // TODO: i dont freaking know what to do with this coz we neeg to think about about data sharing between widgets
		chart: {}, // TODO: add chart data
	};

	return response;
}

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
	modules?: IAltcoinSeasonConfig['modules'];
}


export interface IAltcoinSeasonDataResponse {
	widgetConfig: IAltcoinSeasonConfig;
	performanceRank: IPerformanceRank;
	historicalValues: IHistoricalValue;
	top100: unknown;
	chart: unknown;
}

export async function getAltcoinSeason(request: IAltcoinSeasonRequest): Promise<IAltcoinSeasonDataResponse> {
	const logger = useLogger();

	try {
		const response = await sendRequestByProvider(dataProvider, request);

		return response;
	} catch (error) {
		logger.error('Failed to get altcoin season', error as Error);
		throw error;
	}
}

function sendRequestByProvider(
	type: DataProvider,
	request: IAltcoinSeasonRequest,
): Promise<IAltcoinSeasonDataResponse> {
	const httpService = useHttpService();

	switch (type) {
		case DataProvider.Production:
			return httpService.get<IAltcoinSeasonDataResponse>('https://gateway.planet9.uk/altcoin-season', {
				query: { market: request.market, period: request.period || '90D' },
			});
		case DataProvider.MockLocal:
			return getMockData(request);
		case DataProvider.MockServer:
			return httpService.get<IAltcoinSeasonDataResponse>('/api/altcoin-season');
		default:
			return getMockData(request);
	}
}

async function getMockData(request: IAltcoinSeasonRequest): Promise<IAltcoinSeasonDataResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 200);
	});

	const btcRank = Math.floor(Math.random() * 30) + 1;
	const fetchPeriod = request.period || '90D';

	const widgetConfigMockData: IAltcoinSeasonConfig = {
		period: fetchPeriod,
		modules: request.modules || {
			performanceRank: true,
			historicalValues: true,
			top100: true,
			chart: true,
		},
	};

	const performanceRankMockData: IPerformanceRank =
		{
			btcRank: btcRank,
			maxRank: 30,
			period: fetchPeriod,
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

import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import type { IAltcoinSeasonConfig, IHistoricalValue, IPerformanceRank, Period } from '../model';
import { useFetchMock } from '@/shared/mock';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}
const dataProvider = DataProvider.MockLocal;


export interface IAltcoinSeasonRequest {
	market: string;
	period: Period;
	modules: Partial<IAltcoinSeasonConfig['modules']>;
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
		logger.debug('send request');
		return sendRequestByProvider(dataProvider, request);
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

const { getMock } = useFetchMock<IAltcoinSeasonDataResponse>('/mock/widgets/altcoin-season.json');

async function getMockData(_: IAltcoinSeasonRequest): Promise<IAltcoinSeasonDataResponse> {
	return getMock();
}

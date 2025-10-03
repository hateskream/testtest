import type { IAltcoinSeasonConfig, IHistoricalValue, IPerformanceRank } from '@/modules/widgets/altcoinSeason/model';
import type { IAltcoinSeasonDataResponse, IAltcoinSeasonRequest } from '@/modules/widgets/altcoinSeason/api';

function returnModuleWithDefault<T extends IAltcoinSeasonRequest['modules']>(
	request: T,
	key: keyof T,
) {
	return key in request ? (request[key] as boolean) : true;
}

export async function getAltcoinMockData(request: IAltcoinSeasonRequest): Promise<IAltcoinSeasonDataResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 200);
	});

	const btcRank = Math.floor(Math.random() * 30) + 1;
	const fetchPeriod = request.period;

	const widgetConfigMockData: IAltcoinSeasonConfig = {
		period: fetchPeriod,
		modules: {
			performanceRank: returnModuleWithDefault(request.modules, 'performanceRank'),
			historicalValues: returnModuleWithDefault(request.modules, 'historicalValues'),
			top100: returnModuleWithDefault(request.modules, 'top100'),
			chart: returnModuleWithDefault(request.modules, 'chart'),
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

	return {
		widgetConfig: widgetConfigMockData,
		performanceRank: performanceRankMockData,
		historicalValues: historicalValuesMockData,
		top100: {}, // TODO: i dont freaking know what to do with this coz we need to think about about data sharing between widgets
		chart: {}, // TODO: add chart data
	};
}

import type { IHistoricalValue, IPerformanceRank } from '@/modules/widgets/altcoinSeason/model';
import type { IAltcoinSeasonDataResponse, IAltcoinSeasonRequest } from '@/modules/widgets/altcoinSeason/api';
import { generateRows } from '@/shared/mock';
import { ColumnType, SymbolType } from '@/modules/cell';

export async function getAltcoinMockData(request: IAltcoinSeasonRequest): Promise<IAltcoinSeasonDataResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 200);
	});

	const btcRank = Math.floor(Math.random() * 30) + 1;
	const fetchPeriod = request.period;

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
		performanceRank: performanceRankMockData,
		historicalValues: historicalValuesMockData,
		top100: {
			tickers: generateRows(SymbolType.PlaneText, [ColumnType.ChangePrice24hPercent]),
		},
		chart: {},
	};
}

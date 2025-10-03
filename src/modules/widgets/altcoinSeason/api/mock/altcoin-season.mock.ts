import type { IHistoricalValue, IPerformanceRank, Period } from '@/modules/widgets/altcoinSeason/model';
import type { IAltcoinSeasonDataResponse, IAltcoinSeasonRequest } from '@/modules/widgets/altcoinSeason/api';
import { generateRows } from '@/shared/mock';
import { ColumnType, SymbolType } from '@/modules/cell';

function getMaxRankByPeriod(period: Period) {
	switch (period) {
		case '7D':
			return 30;
		case '30D':
			return 50;
		case '90D':
			return 70;
		case '1Y':
			return 100;
		default:
			return 30;
	}
}

function getRandomInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDates(period: Period): string[] {
	const now = new Date();
	let count = 0;

	switch (period) {
		case '7D':
			count = 7;
			break;
		case '30D':
			count = 30;
			break;
		case '90D':
			count = 13;
			break;
		case '1Y':
			count = 12;
			break;
	}

	const result: string[] = [];
	for (let i = count - 1; i >= 0; i -= 1) {
		const d = new Date(now);
		if (period === '1Y') {
			d.setMonth(now.getMonth() - i);
		} else {
			d.setDate(now.getDate() - i);
		}
		result.push(d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' }));
	}
	return result;
}

function generateMetrics(period: Period, max: number): number[] {
	const count = period === '1Y' ? 12 : period === '90D' ? 13 : period === '30D' ? 30 : 7;
	return Array.from({ length: count }, () => getRandomInt(0, max));
}

export async function getAltcoinMockData(request: IAltcoinSeasonRequest): Promise<IAltcoinSeasonDataResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 200);
	});

	const maxRank = getMaxRankByPeriod(request.period);
	const btcRank = getRandomInt(1, maxRank);

	const performanceRankMockData: IPerformanceRank = {
		period: request.period,
		btcRank,
		maxRank,
	};

	const historicalValuesMockData: IHistoricalValue = {
		today: btcRank,
		lastWeek: getRandomInt(1, maxRank),
		lastMonth: getRandomInt(1, maxRank),
	};

	return {
		performanceRank: performanceRankMockData,
		historicalValues: historicalValuesMockData,
		top100: {
			tickers: generateRows(SymbolType.PlaneText, [ColumnType.ChangePrice24hPercent]),
		},
		chart: {
			labels: generateDates(request.period),
			metrics: generateMetrics(request.period, 100),
		},
	};
}

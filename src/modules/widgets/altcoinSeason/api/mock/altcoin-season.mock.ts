import type { Period } from '@/modules/widgets/altcoinSeason/model';
import type { IAltcoinSeasonDataResponse, IAltcoinSeasonRequest } from '@/modules/widgets/altcoinSeason/api';
import { generateRows } from '@/shared/mock';
import { ColumnType, SymbolType } from '@/modules/cell';

function getMaxRankByPeriod(period: Period) {
	switch (period) {
		case '7D':
			return 7;
		case '30D':
			return 30;
		case '90D':
			return 90;
		case '1Y':
			return 365;
		default:
			return 90;
	}
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
			count = 90;
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

const METRICS: Record<Period, number[]> = {
	'7D': [
		6, 9, 5, 12, 15, 8, 18,
	],
	'30D': [
		4, 6, 9, 8, 12, 15, 11, 17, 13, 19,
		10, 16, 14, 22, 18, 21, 25, 23, 20, 27,
		15, 19, 24, 22, 26, 28, 23, 12, 15,
	],
	'90D': [
		5, 12, 3, 18, 9, 22, 7, 15, 2, 19,
		8, 14, 6, 21, 4, 17, 10, 25, 13, 7,
		1, 16, 9, 23, 5, 20, 11, 24, 3, 18,
		7, 14, 2, 19, 8, 13, 6, 21, 4, 17,
		10, 26, 12, 5, 15, 9, 23, 7, 20, 11,
		24, 3, 18, 6, 22, 4, 17, 9, 25, 13,
		7, 14, 2, 19, 8, 15, 5, 21, 10, 26,
		12, 6, 23, 7, 20, 11, 24, 3, 18, 9,
		22, 4, 17, 10, 25, 13, 7, 14, 2, 26,
	],
	'1Y': [
		4, 7, 5, 6, 8, 7, 1, 12, 4, 12,
		2, 4,
	],
};

function getBtcRankFromMetrics(metrics: number[]): number {
	const lastIndex = metrics.length - 1;
	return metrics[lastIndex] ?? 1;
}

function getHistoricalFromMetrics(metrics: number[]) {
	const len = metrics.length;

	const today = metrics[len - 1] ?? 1;
	const lastWeek = len > 7 ? metrics[len - 8] : today;
	const lastMonth = len > 30 ? metrics[len - 31] : metrics[0] ?? today;

	return { today, lastWeek, lastMonth };
}

export async function getAltcoinMockData(request: IAltcoinSeasonRequest): Promise<IAltcoinSeasonDataResponse> {
	await new Promise(resolve => {
		setTimeout(resolve, 200);
	});

	const maxRank = getMaxRankByPeriod(request.period);
	const metrics = METRICS[request.period];

	const btcRank = getBtcRankFromMetrics(metrics);
	const historicalValues = getHistoricalFromMetrics(metrics);

	return {
		performanceRank: {
			period: request.period,
			btcRank: btcRank,
			maxRank: maxRank,
		},
		historicalValues,
		top100: {
			tickers: generateRows(SymbolType.PlaneText, [ColumnType.ChangePrice24hPercent]),
		},
		chart: {
			labels: generateDates(request.period),
			metrics,
		},
	};
}

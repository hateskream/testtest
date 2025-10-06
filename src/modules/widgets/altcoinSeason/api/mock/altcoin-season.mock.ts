import type { Period } from '@/modules/widgets/altcoinSeason/model';
import type { IAltcoinSeasonDataResponse, IAltcoinSeasonRequest } from '@/modules/widgets/altcoinSeason/api';
import { generateRows } from '@/shared/mock';
import { ColumnType, SymbolType } from '@/modules/cell';

const METRICS: Record<Period, number[]> = {
	'7D': [
		6, 9, 5, 12, 15, 8, 18,
	],
	'30D': [
		4, 6, 9, 8, 12, 15, 11, 17, 13, 19,
		10, 16, 14, 22, 18, 21, 25, 23, 20, 27,
		15, 19, 24, 22, 26, 28, 23, 12, 15, 15,
	],
	'90D': [
		5, 12, 3, 18, 9, 22, 7, 15, 2, 19,
		8, 14, 6, 21, 4, 17, 10, 25, 13, 7,
		1, 16, 9, 23, 5, 20, 11, 24, 3, 25,
	],
	'1Y': [
		4, 7, 5, 6, 8, 7, 1, 12, 4, 12,
		2, 4,
	],
};

function generateDates(period: Period): string[] {
	const now = new Date();
	const count = METRICS[period].length;

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

	const metrics = METRICS[request.period];

	const btcRank = getBtcRankFromMetrics(metrics);
	const historicalValues = getHistoricalFromMetrics(metrics);

	return {
		performanceRank: {
			period: request.period,
			btcRank: btcRank,
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

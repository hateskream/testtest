import type { RevenueQuarter, RevenueYearlyPoint } from './revenue.ts';

export const REPORTED_COLORS = [
	'#F3F3F3',
	'#A3A3A3',
	'#6F6F70',
	'#3C3C3D',
] as const;

export const ESTIMATES_COLORS = [
	'#FF7029',
	'#D7570D',
	'#B93900',
	'#870700',
] as const;

export function getQuarterColor(quarter: RevenueQuarter) {
	if (quarter.isEstimate) {
		return ESTIMATES_COLORS[quarter.quarter - 1];
	}

	return REPORTED_COLORS[quarter.quarter - 1];
}

export const REPORTED_LINE_COLOR = '#fff';
export const ESTIMATES_LINE_COLOR = '#FF8D29';

export function getYearlyPointColor(point: RevenueYearlyPoint) {
	return point.isEstimate ? ESTIMATES_LINE_COLOR : REPORTED_LINE_COLOR;
}

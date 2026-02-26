import type { BaselineData, Time, UTCTimestamp } from 'lightweight-charts';

import type { IndicatorPoint, IndicatorResult } from './indicator';

export function toUTCTimestamp(time: number): UTCTimestamp {
	return time as UTCTimestamp;
}

export function mapIndicatorPointToBaselinePoint(point: IndicatorPoint): BaselineData<Time> {
	return {
		time: toUTCTimestamp(point.time),
		value: point.value,
	};
}

export function mapIndicatorToBaselineSeries(result: IndicatorResult): BaselineData<Time>[] {
	return result.values.map(mapIndicatorPointToBaselinePoint);
}

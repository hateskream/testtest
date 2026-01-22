import type { ActivityMetricsResponse } from './contract';
import { keysToCamel } from '@/shared/lib';
import { MarketType } from '@/modules/market';
import type { ActivityMetrics } from '../model';

export function mapActivityMetricsResponseToModel
<T extends MarketType>(response: ActivityMetricsResponse<T>) {
	const camelized = keysToCamel(response);
	return camelized as ActivityMetrics<T>;
}

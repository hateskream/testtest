import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import type {
	IMetricTrendBadge,
	INonfarmPayrollsData,
	INonfarmPayrollsResponse,
} from '../model';

export interface IGetNonfarmPayrollsRequest {
	widgetId: string;
}

export async function getNonfarmPayrolls(
	args: IGetNonfarmPayrollsRequest,
): Promise<INonfarmPayrollsData> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		const response = await httpService.get<INonfarmPayrollsResponse>(
			'api/v1/nonfarm-payrolls/data',
			{
				query: {
					widgetId: args.widgetId,
				},
			},
		);
		return transformNonfarmPayrollsData(response);
	} catch (error) {
		logger.error('Failed to get unemployment rate data', error as Error);
		throw error;
	}
}

export function transformNonfarmPayrollsData(
	data: INonfarmPayrollsResponse,
): INonfarmPayrollsData {
	const badge: IMetricTrendBadge = {
		topValue: parseFloat(data.primaryValue),
		isTopValuePercent: data.primaryValueUnit === '%',
		label: 'vs previous period',
		value: data.change.value,
		unit: data.change.unit,
		trend: data.change.direction,
		isGood: data.change.isPositive,
		isPercent: data.change.unit === '%' || data.change.unit === 'pp',
	};

	return {
		badge,
		points: data.points,
	};
}


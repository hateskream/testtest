import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import type { IMetricTrendBadge, INonfarmPayrollsData, INonfarmPayrollsResponse } from '../model';

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
		logger.error('Failed to get unemployment rate data', { error: error as Error });
		throw error;
	}
}

export function transformNonfarmPayrollsData(
	data: INonfarmPayrollsResponse,
): INonfarmPayrollsData {
	const badge: IMetricTrendBadge = {
		topValue: parseFloat(data.primaryValue),
		isTopValuePercent: data.primaryValueUnit === '%',
		label: `Payrolls ${data.change.isPositive ? 'up' : 'down'} YoY`,
		value: data.change.value,
		unit: data.change.unit,
		trend: data.change.direction,
		isGood: data.change.isPositive,
		isPercent: data.change.unit === '%' || data.change.unit === 'pp',
	};

	const points = data.points.map(point => ({
		time: point.label,
		value: point.history,
	}));

	return {
		badge,
		points,
	};
}

import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import type {
	IMetricTrendBadge,
	IUnemploymentRateData,
	IUnemploymentRateResponse,
} from '@/modules/widgets/unemployment-rate/model';

export interface IGetUnemploymentRateRequest {
	widgetId: string;
}

export async function getUnemploymentRate(
	args: IGetUnemploymentRateRequest,
): Promise<IUnemploymentRateData> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		const response = await httpService.get<IUnemploymentRateResponse>(
			'api/v1/unemployment-rate/data',
			{
				query: {
					widgetId: args.widgetId,
				},
			},
		);
		return transformUnemploymentRateData(response);
	} catch (error) {
		logger.error('Failed to get unemployment rate data', { error: error as Error });
		throw error;
	}
}

export function transformUnemploymentRateData(
	data: IUnemploymentRateResponse,
): IUnemploymentRateData {
	const badge: IMetricTrendBadge = {
		topValue: parseFloat(data.primaryValue),
		isTopValuePercent: data.primaryValueUnit === '%',
		label: `Rate ${data.change.isPositive ? 'down' : 'up'} YoY`,
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


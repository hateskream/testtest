import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import type { IUnemploymentRateResponse } from '@/modules/widgets/unemployment-rate/model';

export interface IGetUnemploymentRateRequest {
	widgetId: string;
}

export async function getUnemploymentRate(
	args: IGetUnemploymentRateRequest,
): Promise<IUnemploymentRateResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		return await httpService.get<IUnemploymentRateResponse>(
			'/api/v1/unemployment-rate/data',
			{
				query: {
					widgetId: args.widgetId,
				},
			},
		);
	} catch (error) {
		logger.error('Failed to get unemployment rate data', { error: error as Error });
		throw error;
	}
}

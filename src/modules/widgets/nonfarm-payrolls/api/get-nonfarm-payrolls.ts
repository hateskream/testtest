import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import type { INonfarmPayrollsData } from '../model';

export interface IGetNonfarmPayrollsRequest {
	widgetId: string;
}

export async function getNonfarmPayrolls(
	args: IGetNonfarmPayrollsRequest,
): Promise<INonfarmPayrollsData> {
	const httpService = useHttpService();
	const logger = useLogger();

	try {
		return await httpService.get<INonfarmPayrollsData>(
			'api/v1/nonfarm-payrolls/data',
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

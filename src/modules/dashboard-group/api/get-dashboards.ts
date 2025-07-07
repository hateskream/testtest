import { useLogger } from '@/shared/service/logger';
import { useUsecase } from '../composables/use-usecase';
import type { IDashboardGroup } from '../new-model/model';

export interface IGetDashboardsReq {
	userId: string;
}

export interface IGetDashboardsRes {
	dashboardGroup: IDashboardGroup;
}

export async function GetDashboards(req: IGetDashboardsReq): Promise<IGetDashboardsRes> {
	const uc = useUsecase();
	const logger = useLogger();
	try {
		const response = await uc.GetDashboardsUc().execute(req);
		return response;
	} catch (error) {
		logger.error('Failed to get dashboards', error as Error);
		throw error;
	}
}

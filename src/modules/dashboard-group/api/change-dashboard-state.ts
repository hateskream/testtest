import { useLogger } from '@/shared/service/logger';
import { useUsecase } from '../composables/use-usecase';
import type { IWidgetState } from '../new-model/model';

export interface IChangeDashboardStateReq {
	dashboardState: IWidgetState[];
}

export async function ChangeDashboardState(req: IChangeDashboardStateReq): Promise<void> {
	const uc = useUsecase();
	const logger = useLogger();
	try {
		await uc.ChangeDashboardStateUc().execute(req);
	} catch (error) {
		logger.error('Failed to change dashboard state', error as Error);
		throw error;
	}
}

import { useLogger } from '@/shared/service/logger';
import { useUsecase } from '../composables/use-usecase';
import type { IDashboard, IWidgetPreset } from '../new-model/model';

export interface IDeleteTabReq {
	tabId: string;
}

export interface IDeleteTabRes {
	dashboard: IDashboard;
	widgets: IWidgetPreset[];
}

export async function DeleteTab(req: IDeleteTabReq): Promise<IDeleteTabRes> {
	const uc = useUsecase();
	const logger = useLogger();
	try {
		const response = await uc.DeleteTabUc().execute(req);
		return response;
	} catch (error) {
		logger.error('Failed to delete tab', error as Error);
		throw error;
	}
}

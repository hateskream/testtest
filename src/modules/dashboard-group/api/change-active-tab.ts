import { useLogger } from '@/shared/service/logger';
import { useUsecase } from '../composables/use-usecase';
import type { IDashboard } from '../model';
import { mapDashboard } from './mapping';

export interface IChangeActiveTabReq {
	tabId: string;
}

export interface IChangeActiveTabRes {
	activeTabId: string;
	dashboard: IDashboard;
}

export async function ChangeActiveTab(req: IChangeActiveTabReq): Promise<IChangeActiveTabRes> {
	const uc = useUsecase();
	const logger = useLogger();
	try {
		const response = await uc.ChangeActiveTabUc().execute(req);

		return {
			activeTabId: response.activeTabId,
			dashboard: mapDashboard(response.dashboard),
		};
	} catch (error) {
		logger.error('Failed to change active tab', error as Error);
		throw error;
	}
}

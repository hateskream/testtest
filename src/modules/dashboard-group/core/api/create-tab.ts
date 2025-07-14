import { useLogger } from '@/shared/service/logger';
import { useUsecase } from '../composables/use-usecase';
import type { IDashboard, IWidgetPreset } from '../model';
import { mapDashboard, mapWidgetsPreset } from './mapping';

export interface ICreateTabRes {
	activeDashboardId: string;
	dashboard: IDashboard;
	widgets: IWidgetPreset[];
}

export async function CreateTab(): Promise<ICreateTabRes> {
	const uc = useUsecase();
	const logger = useLogger();
	try {
		const response = await uc.CreateTabUc().execute();

		return {
			activeDashboardId: response.activeDashboardId,
			dashboard: mapDashboard(response.dashboard),
			widgets: mapWidgetsPreset(response.widgets),
		};
	} catch (error) {
		logger.error('Failed to create tab', error as Error);
		throw error;
	}
}

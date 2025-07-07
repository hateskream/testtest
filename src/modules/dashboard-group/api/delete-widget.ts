import { useLogger } from '@/shared/service/logger';
import { useUsecase } from '../composables/use-usecase';
import type { IWidgetState } from '../new-model/model';

export interface IDeleteWidgetReq {
	widgetId: string;
	dashboardState: IWidgetState[];
}

export interface IDeleteWidgetRes {
	widgetId: string;
}

export async function DeleteWidget(req: IDeleteWidgetReq): Promise<IDeleteWidgetRes> {
	const uc = useUsecase();
	const logger = useLogger();
	try {
		const response = await uc.DeleteWidgetUc().execute(req);
		return response;
	} catch (error) {
		logger.error('Failed to delete widget', error as Error);
		throw error;
	}
}

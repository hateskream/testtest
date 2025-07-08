import { useLogger } from '@/shared/service/logger';
import { useUsecase } from '../composables/use-usecase';
import type { IPosition } from '../model';

export interface IAddWidgetReq {
	widgetType: string;
	position: IPosition;
}

export interface IAddWidgetRes {
	widgetId: string;
}

export async function AddWidget(req: IAddWidgetReq): Promise<IAddWidgetRes> {
	const uc = useUsecase();
	const logger = useLogger();

	try {
		const response = await uc.AddWidgetUc().execute(req);

		return response;
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}

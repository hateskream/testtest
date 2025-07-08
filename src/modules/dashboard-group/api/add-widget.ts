import { useLogger } from '@/shared/service/logger';
import { useUsecase } from '../composables/use-usecase';
import type { IPosition, IWidget, IWidgetState } from '../model';
import { mapWidget } from './mapping';

export interface IAddWidgetReq {
	widgetType: string;
	position: IPosition;
	widgetsState: IWidgetState[];
}

export interface IAddWidgetRes {
	widget: IWidget;
}

export async function AddWidget(req: IAddWidgetReq): Promise<IAddWidgetRes> {
	const uc = useUsecase();
	const logger = useLogger();

	try {
		const response = await uc.AddWidgetUc().execute(req);

		return {
			widget: mapWidget(response.widget),
		};
	} catch (error) {
		logger.error('Failed to get market', error as Error);
		throw error;
	}
}

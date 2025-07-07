import { useLogger } from '@/shared/service/logger';
import { useUsecase } from '../composables/use-usecase';
import type { IWidgetPreset } from '../new-model/model';

export interface IGetWidgetListRes {
	widgets: IWidgetPreset[];
}

export async function GetWidgetList(): Promise<IGetWidgetListRes> {
	const uc = useUsecase();
	const logger = useLogger();
	try {
		const response = await uc.GetWidgetListUc().execute();
		return response;
	} catch (error) {
		logger.error('Failed to get widget list', error as Error);
		throw error;
	}
}

import { useLogger } from '@/shared/service/logger';
import { useUsecase } from '../composables/use-usecase';
import type { IWidgetPreset } from '../new-model/model';

export interface ICreateTabRes {
	tabId: string;
	widgets: IWidgetPreset[];
}

export async function CreateTab(): Promise<ICreateTabRes> {
	const uc = useUsecase();
	const logger = useLogger();
	try {
		const response = await uc.CreateTabUc().execute();
		return response;
	} catch (error) {
		logger.error('Failed to create tab', error as Error);
		throw error;
	}
}

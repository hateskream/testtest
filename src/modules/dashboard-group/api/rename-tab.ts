import { useLogger } from '@/shared/service/logger';
import { useUsecase } from '../composables/use-usecase';

export interface IRenameTabReq {
	tabId: string;
	name: string;
}

export interface IRenameTabRes {
	tabId: string;
}

export async function RenameTab(req: IRenameTabReq): Promise<IRenameTabRes> {
	const uc = useUsecase();
	const logger = useLogger();
	try {
		const response = await uc.RenameTabUc().execute(req);
		return response;
	} catch (error) {
		logger.error('Failed to rename tab', error as Error);
		throw error;
	}
}

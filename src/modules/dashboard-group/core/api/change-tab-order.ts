import { useLogger } from '@/shared/service/logger';
import { useUsecase } from '../composables/use-usecase';

export interface IChangeTabOrderReq {
	ids: string[];
}

export async function ChangeTabOrder(req: IChangeTabOrderReq): Promise<void> {
	const uc = useUsecase();
	const logger = useLogger();
	try {
		await uc.ChangeTabOrderUc().execute(req);
	} catch (error) {
		logger.error('Failed to change tab order', error as Error);
		throw error;
	}
}

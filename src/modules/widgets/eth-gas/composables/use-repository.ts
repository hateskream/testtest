import { LocalRepository } from '../service';

export function useRepository(widgetId: string) {
	return LocalRepository.create('__ETH_GAS_', widgetId, {
		isSaveChange: true,
	});
}

import { LocalRepository } from '../service';

export function useRepository(widgetId: string) {
	return LocalRepository.create('__PRICE__', widgetId, {
		isSaveChange: true,
	});
}

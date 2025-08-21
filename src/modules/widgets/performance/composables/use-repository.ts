import { LocalRepository } from '../service';

export function useRepository(widgetId: string) {
	return LocalRepository.create('__PERFORMANCE__', widgetId, {
		isSaveChange: true,
	});
}

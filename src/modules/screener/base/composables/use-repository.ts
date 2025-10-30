import { LocalRepository } from '../service';

export function useRepository(widgetId: string) {
	return LocalRepository.create('__SCREENER__', widgetId, {
		isSaveChange: true,
	});
}

import { LocalRepository } from '../service';

export function useRepository(widgetId: string) {
	return LocalRepository.create('__WATCHLIST__', widgetId, {
		isSaveChange: true,
	});
}

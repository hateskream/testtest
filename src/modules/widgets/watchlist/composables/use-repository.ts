import { LocalRepository } from '../service';

export function useRepository(widgetId: string) {
	return LocalRepository.create('__WATCHLIST_WIDGET__', widgetId, {
		isSaveChange: true,
	});
}

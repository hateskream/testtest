import { LocalRepository } from '../service';

export function useRepository(widgetId: string) {
	return LocalRepository.create('__MARKET__', widgetId, {
		isSaveChange: true,
	});
}

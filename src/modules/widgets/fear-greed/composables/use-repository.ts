import { LocalRepository } from '../service';

export function useRepository(widgetId: string) {
	return LocalRepository.create('__FEAR_GREED__', widgetId, {
		isSaveChange: true,
	});
}

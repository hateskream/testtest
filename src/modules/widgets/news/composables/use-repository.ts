import { LocalRepository } from '../service';

export function useRepository(widgetId: string) {
	return LocalRepository.create('__NEWS__', widgetId, {
		isSaveChange: true,
	});
}

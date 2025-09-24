import { LocalRepository } from '../service';

export function useRepository(widgetId: string) {
	return LocalRepository.create('__HEATMAP__', widgetId, {
		isSaveChange: true,
	});
}

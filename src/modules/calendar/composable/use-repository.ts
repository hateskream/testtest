import { type ILocalRepositoryOptions, LocalRepository } from '../services';

export function useRepository(widgetId: string, options: ILocalRepositoryOptions) {
	return LocalRepository.create('__CALENDAR_FILTER__', widgetId, options);
}

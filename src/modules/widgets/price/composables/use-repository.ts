import { LocalRepository } from '../service';

export function useRepository(widgetId: string, defaultStateType: string) {
	return LocalRepository.create(
		'__PRICE__',
		widgetId,
		defaultStateType,
		{
			isSaveChange: true,
		},
	);
}

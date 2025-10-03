import { AltcoinLocalRepository, type IOptions } from '../services/local-repository.ts';

export function useRepository(widgetId: string, options: IOptions) {
	return AltcoinLocalRepository.create('__ALTCOIN__', widgetId, options);
}

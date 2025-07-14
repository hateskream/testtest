import { LocalFactory } from '../infrastructere';

export function useUsecase() {
	const ucFactory = LocalFactory('__DASHBOARD_GROUP__', { isSaveChange: true });

	return ucFactory;
}

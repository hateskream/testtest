import { LocalFactory } from '../infrastructere';

export function useUsecase() {
	const ucFactory = LocalFactory('__DASHBOARD_GROUP__');

	return ucFactory;
}

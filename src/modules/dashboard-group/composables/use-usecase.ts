import { LocalFactory } from '../infrastructere';

export function useUsecase() {
	const ucFactory = LocalFactory('dashboard-groups');

	return ucFactory;
}

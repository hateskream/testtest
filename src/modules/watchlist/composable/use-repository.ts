import { LocalRepository } from '../service';

export function useRepository() {
	return LocalRepository.create('__WATCHLIST__', {
		isSaveChange: true,
	});
}

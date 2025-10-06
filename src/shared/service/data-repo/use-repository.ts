import { LocalRepository, type IOptionsLocal } from './local-repository';
import type { IOptionsRemote } from './remote-repository';

export interface IOptions<TData, TSchema>
	extends IOptionsLocal<TData, TSchema>, Omit<IOptionsRemote<TData, TSchema>, 'userId'> {}

export function useRepository<TData, TSchema>(options: IOptions<TData, TSchema>) {
	return LocalRepository.create(options);
}

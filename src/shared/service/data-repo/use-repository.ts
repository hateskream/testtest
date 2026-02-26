import { type IOptionsLocal, LocalRepository } from './local-repository';
import type { IOptionsRemote } from './remote-repository';

export interface IOptionsRepository<TData, TSchema, TInput = TSchema>
	extends IOptionsLocal<TData, TSchema, TInput>, Omit<IOptionsRemote<TData, TSchema, TInput>, 'userId'> {}

export function useRepository<TData, TSchema, TInput = TSchema>(options: IOptionsRepository<TData, TSchema, TInput>) {
	return LocalRepository.create<TData, TSchema, TInput>(options);
}

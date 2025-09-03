import { getDefaultState } from '../model';
import { BaseRepository } from './base-repository';
import type { StateSchemaType } from './validator';

export interface IOptions {
	isSaveChange: boolean;
}

export class LocalRepository extends BaseRepository {
	private static instance: LocalRepository | null = null;

	public static create(
		storageKey: string,
		options?: IOptions,
	): LocalRepository {
		if (!this.instance) {
			this.instance = new LocalRepository(storageKey, options);
		}
		return this.instance;
	}

	private constructor(
		private readonly storageKey: string,
		private readonly options?: IOptions,
	) {
		super();
	}

	protected async getter(): Promise<StateSchemaType> {
		const raw = localStorage.getItem(this.storageKey);
		if (raw === null) {
			const state = getDefaultState();
			const hydrated = await this.set(state);

			return hydrated;
		}

		const data = JSON.parse(raw) as StateSchemaType;
		return data;
	}

	protected async setter(settings: StateSchemaType): Promise<void> {
		if (!this.options?.isSaveChange) {
			return;
		}

		const raw = JSON.stringify(settings);
		localStorage.setItem(this.storageKey, raw);
	}
}

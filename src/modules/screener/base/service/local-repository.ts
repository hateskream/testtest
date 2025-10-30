import { getDefaultState } from '../model';
import { BaseRepository } from './base-repository';
import type { StateSchemaType } from './validator';

export interface IOptions {
	isSaveChange: boolean;
}

export class LocalRepository extends BaseRepository {
	private static instances: Map<string, LocalRepository> = new Map();
	private readonly storageKey: string;

	public static create(
		storageKey: string,
		widgetId: string,
		options?: IOptions,
	): LocalRepository {
		if (!this.instances.has(widgetId)) {
			this.instances.set(widgetId, new LocalRepository(storageKey, widgetId, options));
		}
		return this.instances.get(widgetId)!;
	}

	private constructor(
		private readonly _storageKey: string,
		widgetId: string,
		private readonly options?: IOptions,
	) {
		super();
		this.storageKey = `${this._storageKey}${widgetId}`;
	}

	protected async getter(): Promise<StateSchemaType> {
		const raw = localStorage.getItem(this.storageKey);
		if (raw === null) {
			const state = getDefaultState();
			return await this.set(state);
		}

		return JSON.parse(raw) as StateSchemaType;
	}

	protected async setter(settings: StateSchemaType): Promise<void> {
		if (!this.options?.isSaveChange) {
			return;
		}

		const raw = JSON.stringify(settings);
		localStorage.setItem(this.storageKey, raw);
	}
}

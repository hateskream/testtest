import { getDefaultViewState, type ISettings } from '../model';
import { BaseRepository } from './base-repository';
import type { ISettingsSchema } from './validator';

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
		super(widgetId);

		this.storageKey = `${this._storageKey}${widgetId}`;
	}

	protected async getter(): Promise<ISettings> {
		const raw = localStorage.getItem(this.storageKey);
		if (raw === null) {
			const state = getDefaultViewState();
			await this.set(state);
			return state;
		}

		const data = JSON.parse(raw) as ISettingsSchema;
		return data;
	}

	protected async setter(settings: ISettings): Promise<void> {
		if (!this.options?.isSaveChange) {
			return;
		}

		const raw = JSON.stringify(settings);
		localStorage.setItem(this.storageKey, raw);
	}
}

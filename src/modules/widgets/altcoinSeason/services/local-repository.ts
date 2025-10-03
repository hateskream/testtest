import { BaseRepository } from './base-repository'; // та универсальная версия из прошлого шага
import { type AltcoinSeasonSchemaType } from './schema';
import { getDefaultConfigState } from '@/modules/widgets/altcoinSeason/model';

export interface IOptions {
	isSaveChange?: boolean;
}

export class AltcoinLocalRepository extends BaseRepository {
	private static instances = new Map<string, AltcoinLocalRepository>();
	private readonly storageKey: string;

	public static create(
		baseKey: string,
		widgetId: string,
		options?: IOptions,
	): AltcoinLocalRepository {
		if (!this.instances.has(widgetId)) {
			this.instances.set(widgetId, new AltcoinLocalRepository(baseKey, widgetId, options));
		}
		return this.instances.get(widgetId)!;
	}

	private constructor(
		private readonly baseKey: string,
		widgetId: string,
		private readonly options?: IOptions,
	) {
		super();
		this.storageKey = `${this.baseKey}${widgetId}`;
	}

	protected async getter() {
		const raw = localStorage.getItem(this.storageKey);
		if (raw === null) {
			return this.set(getDefaultConfigState());
		}

		return JSON.parse(raw) as AltcoinSeasonSchemaType;
	}

	protected async setter(settings: AltcoinSeasonSchemaType): Promise<void> {
		if (!this.options?.isSaveChange) {
			return;
		}
		localStorage.setItem(this.storageKey, JSON.stringify(settings));
	}
}

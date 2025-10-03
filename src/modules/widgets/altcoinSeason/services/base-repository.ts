import { altcoinSeasonSchema, type AltcoinSeasonSchemaType } from '@/modules/widgets/altcoinSeason/services/schema.ts';

export abstract class BaseRepository {
	protected abstract getter(): Promise<AltcoinSeasonSchemaType>;
	protected abstract setter(state: AltcoinSeasonSchemaType): Promise<void>;

	protected check(data: unknown): asserts data is AltcoinSeasonSchemaType {
		const result = altcoinSeasonSchema.safeParse(data);
		if (!result.success) {
			throw new Error(`Failed to parse state\n${result.error}`);
		}
	}

	protected rehydrate(data: unknown): AltcoinSeasonSchemaType {
		this.check(data);
		return data;
	}

	protected hydrate(data: AltcoinSeasonSchemaType): AltcoinSeasonSchemaType {
		this.check(data);
		return data;
	}

	public async get(): Promise<AltcoinSeasonSchemaType> {
		const raw = await this.getter();
		return this.rehydrate(raw);
	}

	public async set(state: AltcoinSeasonSchemaType): Promise<AltcoinSeasonSchemaType> {
		const hydrated = this.hydrate(state);
		await this.setter(hydrated);
		return hydrated;
	}
}

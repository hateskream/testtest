import { type ISettings } from '../model';
import { FailedParse } from './error';
import { settingsSchema, type ISettingsSchema } from './validator';

export abstract class BaseRepository {
	protected abstract getter(): Promise<ISettings>;
	protected abstract setter(settings: ISettings): Promise<void>;

	protected check(data: ISettingsSchema): void {
		const { success, error } = settingsSchema.safeParse(data);

		if (!success) {
			throw new FailedParse(`Failed to parse settings\nError: ${error}`);
		}
	}

	protected rehydrate(data: ISettingsSchema): ISettings {
		this.check(data);
		return data;
	}

	protected hydrate(data: ISettings): ISettingsSchema {
		this.check(data);
		return data;
	}

	public async get(): Promise<ISettings> {
		const data = await this.getter();
		return this.rehydrate(data);
	}

	public async set(settings: ISettings): Promise<void> {
		const hydrated = this.hydrate(settings);
		await this.setter(hydrated);
	}
}

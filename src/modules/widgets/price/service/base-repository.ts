import { type IState } from '../model';
import { FailedParse } from './error';
import { stateSchema, type StateSchemaType } from './validator';

export abstract class BaseRepository {
	protected abstract getter(): Promise<IState>;
	protected abstract setter(settings: IState): Promise<void>;

	protected check(data: IState): void {
		const { success, error } = stateSchema.safeParse(data);

		if (!success) {
			throw new FailedParse(`Failed to parse settings\nError: ${error}`);
		}
	}

	protected rehydrate(data: StateSchemaType): IState {
		this.check(data);
		return data;
	}

	protected hydrate(data: IState): StateSchemaType {
		this.check(data);
		return data;
	}

	public async get(): Promise<IState> {
		const data = await this.getter();
		return this.rehydrate(data);
	}

	public async set(settings: IState): Promise<void> {
		const hydrated = this.hydrate(settings);
		await this.setter(hydrated);
	}
}

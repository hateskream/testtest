import {
	hydrateState,
	rehydrateState,
	type IState,
} from '../model';
import { FailedParse } from './error';
import { stateSchema, type StateSchemaType } from './validator';

export abstract class BaseRepository {
	protected abstract getter(): Promise<StateSchemaType | null>;
	protected abstract setter(state: StateSchemaType): Promise<void>;

	protected check(data: StateSchemaType): void {
		const { success, error } = stateSchema.safeParse(data);

		if (!success) {
			throw new FailedParse(`Failed to parse settings\nError: ${error}`);
		}
	}

	protected rehydrate(data: StateSchemaType): IState {
		this.check(data);

		return rehydrateState(data);
	}

	protected hydrate(data: IState): StateSchemaType {
		const hydrated = hydrateState(data);

		this.check(hydrated);

		return hydrated;
	}

	public async get(): Promise<IState | null> {
		const data = await this.getter();

		if (data === null) {
			return null;
		}

		return this.rehydrate(data);
	}

	public async set(state: IState): Promise<StateSchemaType> {
		const hydrated = this.hydrate(state);
		await this.setter(hydrated);

		return hydrated;
	}
}

import { toolbarSchema, type ToolbarSchemaType } from './schema.ts';
import type { IToolbarState } from '@/modules/calendar';
import { getHydrated, getRehydrated } from '@/modules/calendar/services/hydration.ts';

export abstract class BaseRepository {
	protected abstract getter(): Promise<ToolbarSchemaType>;
	protected abstract setter(state: ToolbarSchemaType): Promise<void>;

	protected check(data: ToolbarSchemaType): void {
		const { success, error } = toolbarSchema.safeParse(data);
		if (!success) {
			throw new Error(`Failed to parse state\nError: ${error}`);
		}
	}

	protected rehydrate(data: ToolbarSchemaType): IToolbarState {
		this.check(data);

		return getRehydrated(data);
	}

	protected hydrate(data: IToolbarState): ToolbarSchemaType {
		const output = getHydrated(data);

		this.check(output);

		return output;
	}

	public async get(): Promise<IToolbarState> {
		const data = await this.getter();
		return this.rehydrate(data);
	}

	public async set(state: IToolbarState) {
		const hydrated = this.hydrate(state);
		await this.setter(hydrated);
	}
}

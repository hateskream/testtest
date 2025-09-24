import { toolbarSchema, type ToolbarSchemaType } from './schema.ts';
import type { IToolbarState } from '@/modules/calendar';

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
		return data;
	}

	protected hydrate(data: ToolbarSchemaType): IToolbarState {
		this.check(data);
		return data;
	}

	public async get(): Promise<IToolbarState> {
		const data = await this.getter();
		return this.rehydrate(data);
	}

	public async set(state: IToolbarState): Promise<ToolbarSchemaType> {
		const hydrated = this.hydrate(state);
		await this.setter(hydrated);

		return hydrated;
	}
}

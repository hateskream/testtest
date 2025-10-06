import { ZodSchema } from 'zod';

import { FailedParse } from './error';

export interface IBaseOptions<TData, TSchema> {
	entityId: string;
	schema: ZodSchema<TSchema>;
	hydrateFn: (data: TData) => TSchema;
	rehydrateFn: (s: TSchema) => TData;
}


export abstract class BaseRepository<TData, TSchema> {
	protected abstract getter(): Promise<TSchema>;
	protected abstract setter(data: TSchema): Promise<void>;

	constructor(
		private readonly schema: ZodSchema<TSchema>,
		private readonly hydrateFn: (data: TData) => TSchema,
		private readonly rehydrateFn: (s: TSchema) => TData,
	) {}

	protected check(data: TSchema): void {
		const result = this.schema.safeParse(data);

		if (!result.success) {
			throw new FailedParse(`Failed to parse data\nError: ${result.error}`);
		}
	}

	protected rehydrate(data: TSchema): TData {
		this.check(data);
		return this.rehydrateFn(data);
	}

	protected hydrate(data: TData): TSchema {
		const hydrated = this.hydrateFn(data);
		this.check(hydrated);
		return hydrated;
	}

	public async get(): Promise<TData> {
		const raw = await this.getter();
		return this.rehydrate(raw);
	}

	public async set(data: TData): Promise<TSchema> {
		const hydrated = this.hydrate(data);
		await this.setter(hydrated);
		return hydrated;
	}
}

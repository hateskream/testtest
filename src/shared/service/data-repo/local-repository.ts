import { BaseRepository, type IBaseOptions } from './base';

export interface IOptionsLocal<TData, TSchema, TInput = TSchema> extends IBaseOptions<TData, TSchema, TInput> {
	storageKey: string;
	isSaveChange: boolean;
	getDefaultState: () => TData;
}

export class LocalRepository<TData, TSchema, TInput = TSchema> extends BaseRepository<TData, TSchema, TInput> {
	private static instances: Map<string, LocalRepository<unknown, unknown>> = new Map();
	private readonly storageKey: string;
	private readonly isSaveChange: boolean;
	private readonly getDefaultState: () => TData;

	public static create<D, S, I = S>(
		options: IOptionsLocal<D, S, I>,
	): LocalRepository<D, S, I> {
		if (!this.instances.has(options.entityId)) {
			const newInstance = new LocalRepository(options);

			this.instances.set(options.entityId, newInstance as LocalRepository<unknown, unknown>);
		}

		return this.instances.get(options.entityId) as LocalRepository<D, S, I>;
	}

	public static dispose(entityId: string) {
		this.instances.delete(entityId);
	}

	private constructor(
		options: IOptionsLocal<TData, TSchema, TInput>,
	) {
		super(
			options.schema,
			options.hydrateFn,
			options.rehydrateFn,
		);
		this.storageKey = `${options.storageKey}${options.entityId}`;
		this.isSaveChange = options.isSaveChange;
		this.getDefaultState = options.getDefaultState;
	}

	protected async getter() {
		const raw = localStorage.getItem(this.storageKey);
		if (raw === null) {
			const state = this.getDefaultState();
			return this.set(state);
		}

		return JSON.parse(raw);
	}

	protected async setter(data: TSchema): Promise<void> {
		if (!this.isSaveChange) {
			return;
		}

		const raw = JSON.stringify(data);
		localStorage.setItem(this.storageKey, raw);
	}
}

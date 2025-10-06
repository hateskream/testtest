import { BaseRepository, type IBaseOptions } from './base';

export interface IOptionsLocal<TData, TSchema> extends IBaseOptions<TData, TSchema> {
	storageKey: string;
	isSaveChange: boolean;
	getDefaultState: () => TData;
}

export class LocalRepository<TData, TSchema> extends BaseRepository<TData, TSchema> {
	private static instances: Map<string, LocalRepository<unknown, unknown>> = new Map();
	private readonly storageKey: string;
	private readonly isSaveChange: boolean;
	private readonly getDefaultState: () => TData;

	public static create<D, S>(
		options: IOptionsLocal<D, S>,
	): LocalRepository<D, S> {
		if (!this.instances.has(options.entityId)) {
			const newInstance = new LocalRepository(options);

			this.instances.set(options.entityId, newInstance as LocalRepository<unknown, unknown>);
		}
		return this.instances.get(options.entityId) as LocalRepository<D, S>;
	}

	private constructor(
		options: IOptionsLocal<TData, TSchema>,
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
			const hydrated = await this.set(state);

			return hydrated;
		}

		const data = JSON.parse(raw);
		return data;
	}

	protected async setter(data: TSchema): Promise<void> {
		if (!this.isSaveChange) {
			return;
		}

		const raw = JSON.stringify(data);
		localStorage.setItem(this.storageKey, raw);
	}
}

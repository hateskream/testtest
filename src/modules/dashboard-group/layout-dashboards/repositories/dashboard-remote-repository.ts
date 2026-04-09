import { useHttpService } from '@/shared/service/http-service';
import { BaseRepository, type IBaseOptions } from '@/shared/service/data-repo/base';

export interface IDashboardRemoteOptions<TData, TSchema, TInput = TSchema>
	extends IBaseOptions<TData, TSchema, TInput> {
	urlGet: string;
	urlSet: string;
}

export class DashboardRemoteRepository<TData, TSchema, TInput = TSchema>
	extends BaseRepository<TData, TSchema, TInput> {
	private static instances: Map<string, DashboardRemoteRepository<unknown, unknown>> = new Map();
	private readonly httpService = useHttpService();

	private readonly urlGet: string;
	private readonly urlSet: string;

	private constructor(
		options: IDashboardRemoteOptions<TData, TSchema, TInput>,
	) {
		super(
			options.schema,
			options.hydrateFn,
			options.rehydrateFn,
		);

		this.urlGet = options.urlGet;
		this.urlSet = options.urlSet;
	}

	public static create<D, S, I = S>(
		options: IDashboardRemoteOptions<D, S, I>,
	): DashboardRemoteRepository<D, S, I> {
		if (!this.instances.has(options.entityId)) {
			const newInstance = new DashboardRemoteRepository(options);

			this.instances.set(options.entityId, newInstance as DashboardRemoteRepository<unknown, unknown>);
		}

		return this.instances.get(options.entityId) as DashboardRemoteRepository<D, S, I>;
	}

	public static dispose(entityId: string) {
		this.instances.delete(entityId);
	}

	protected async getter(): Promise<TSchema> {
		return this.httpService.get<TSchema>(this.urlGet);
	}

	protected async setter(state: TSchema): Promise<void> {
		await this.httpService.put(
			this.urlSet,
			state as unknown as Record<string, unknown>,
		);
	}
}

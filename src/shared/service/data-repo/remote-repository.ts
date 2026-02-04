import { useHttpService } from '@/shared/service/http-service';
import { BaseRepository, type IBaseOptions } from './base';

export interface IOptionsRemote<TData, TSchema, TInput = TSchema> extends IBaseOptions<TData, TSchema, TInput> {
	userId: string;
	urlGet: string;
	urlSet: string;
}

export class RemoteRepository<TData, TSchema, TInput = TSchema> extends BaseRepository<TData, TSchema, TInput> {
	private static instances: Map<string, RemoteRepository<unknown, unknown>> = new Map();
	private readonly httpService = useHttpService();

	private readonly userId: string;
	private readonly entityId: string;
	private readonly urlGet: string;
	private readonly urlSet: string;

	private constructor(
		options: IOptionsRemote<TData, TSchema, TInput>,
	) {
		super(
			options.schema,
			options.hydrateFn,
			options.rehydrateFn,
		);

		this.userId = options.userId;
		this.entityId = options.entityId;
		this.urlGet = options.urlGet;
		this.urlSet = options.urlSet;
	}

	public static create<D, S, I = S>(options: IOptionsRemote<D, S, I>): RemoteRepository<D, S, I> {
		if (!this.instances.has(options.entityId)) {
			const newInstance = new RemoteRepository(options);

			this.instances.set(options.entityId, newInstance as RemoteRepository<unknown, unknown>);
		}

		return this.instances.get(options.entityId) as RemoteRepository<D, S, I>;
	}

	protected async getter() {
		return this.httpService.get<TSchema>(this.urlGet, {
			query: {
				userId: this.userId,
				widgetId: this.entityId,
			},
		});
	}

	protected async setter(state: TSchema): Promise<void> {
		await this.httpService.post(
			this.urlSet,
			state as unknown as Record<string, unknown>,
			{
				query: {
					userId: this.userId,
					widgetId: this.entityId,
				},
			});
	}
}

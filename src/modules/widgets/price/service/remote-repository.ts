import { useHttpService } from '@/shared/service/http-service';
import { type IState } from '../model';
import { BaseRepository } from './base-repository';

export class RemoteRepository extends BaseRepository {
	private static instances: Map<string, RemoteRepository> = new Map();
	private readonly httpService = useHttpService();

	private constructor(
		private readonly userId: string,
		private readonly widgetId: string,
	) {
		super();
	}

	public static create(userId: string, widgetId: string): RemoteRepository {
		if (!this.instances.has(widgetId)) {
			this.instances.set(widgetId, new RemoteRepository(userId, widgetId));
		}
		return this.instances.get(widgetId)!;
	}

	protected async getter(): Promise<IState> {
		return this.httpService.get<IState>('/api/v1/price/settings', {
			query: {
				userId: this.userId,
				widgetId: this.widgetId,
			},
		});
	}

	protected async setter(state: IState): Promise<void> {
		await this.httpService.post(
			'/api/v1/price/settings',
			state as unknown as Record<string, unknown>,
			{
				query: {
					userId: this.userId,
					widgetId: this.widgetId,
				},
			});
	}
}

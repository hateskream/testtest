import { useHttpService } from '@/shared/service/http-service';
import { BaseRepository } from './base-repository';
import type { StateSchemaType } from './validator';

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

	protected async getter(): Promise<StateSchemaType> {
		return this.httpService.get<StateSchemaType>('/api/v1/heatmap/settings', {
			query: {
				userId: this.userId,
				widgetId: this.widgetId,
			},
		});
	}

	protected async setter(state: StateSchemaType): Promise<void> {
		await this.httpService.post(
			'/api/v1/heatmap/settings',
			state as unknown as Record<string, unknown>,
			{
				query: {
					userId: this.userId,
					widgetId: this.widgetId,
				},
			});
	}
}

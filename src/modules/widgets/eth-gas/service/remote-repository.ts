import { useHttpService } from '@/shared/service/http-service';
import { type ISettings } from '../model';
import { BaseRepository } from './base-repository';
import type { ISettingsSchema } from './validator';

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

	protected async getter(): Promise<ISettings> {
		return this.httpService.get<ISettings>('/api/v1/fear-and-greed/settings', {
			query: {
				userId: this.userId,
				widgetId: this.widgetId,
			},
		});
	}

	protected async setter(settings: ISettingsSchema): Promise<void> {
		await this.httpService.post('/api/v1/fear-and-greed/settings', settings, {
			query: {
				userId: this.userId,
				widgetId: this.widgetId,
			},
		});
	}
}

import { removeUndefinedPropertiesFromObject } from '@/shared/lib';
import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import type { IWatchlistWidgetConfig } from '../model';

const IS_USE_MOCK = true;

export interface IGetWatchlistWidgetRequest {
	market: string;
}

export interface IGetWatchlistWidgetResponse {
	config: IWatchlistWidgetConfig;
}

export async function getWatchlistWidget(args: IGetWatchlistWidgetRequest): Promise<IGetWatchlistWidgetResponse> {
	const httpService = useHttpService();
	const logger = useLogger();

	const query = removeUndefinedPropertiesFromObject(args);

	try {
		const response = IS_USE_MOCK
			? await getMockWidgetConfig()
			: await httpService.get<IGetWatchlistWidgetResponse>('/api/watchlist', {
				query,
			});

		return response;
	} catch (error) {
		logger.error('Failed to get watchlist', error as Error);
		throw error;
	}
}

async function getMockWidgetConfig() {
	await new Promise(resolve => setTimeout(resolve, 200));

	const config: IWatchlistWidgetConfig = {
		widgetId: '1',
		activeTabId: '1',
		tabs: [
			{
				id: '1',
				name: 'Favorites',
				order: 1,
			},
			{
				id: '2',
				name: 'My List',
				order: 2,
			},
		],
		// table: [],
	};
	return { config: config };
};

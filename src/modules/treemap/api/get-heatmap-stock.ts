import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import type { ITreemap, ITreemapItem } from '../model';
import { useFetchMock } from '@/shared/mock';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}

const dataProvider = DataProvider.MockLocal;

export async function getHeatmapStock(): Promise<ITreemap | null> {
	const logger = useLogger();

	try {
		const response = await sendRequestByProvider(dataProvider);

		return response;
	} catch (error) {
		logger.error('Failed to get display settings heatmap', error as Error);
		throw error;
	}
}

function sendRequestByProvider(
	type: DataProvider,
): Promise<ITreemap> {
	const httpService = useHttpService();

	switch (type) {
		case DataProvider.Production:
			return httpService.get<ITreemap>('https://gateway.planet9.uk/heatmap/settings');
		case DataProvider.MockLocal:
			return getMockData();
		case DataProvider.MockServer:
			return httpService.get<ITreemap>('/api/heatmap/settings');
		default:
			return getMockData();
	}
}

const { getMock } = useFetchMock<ITreemapItem[]>('/mock/heatmap/stock.json');


async function getMockData(): Promise<ITreemap> {
	const items = await getMock();

	return {
		items,
		currencySymbol: '$',
	};
}

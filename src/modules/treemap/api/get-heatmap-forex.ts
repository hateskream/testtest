import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import type { IHeatmap, IHeatmapItem } from '../model';
import { useFetchMock } from '@/shared/mock';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}

const dataProvider = DataProvider.MockLocal;

interface IGetHeatmapCryptoRequest {
	timeRange: string;
}

export async function getHeatmapForex(req: IGetHeatmapCryptoRequest): Promise<IHeatmap | null> {
	const logger = useLogger();

	try {
		const response = await sendRequestByProvider(dataProvider, req);

		return response;
	} catch (error) {
		logger.error('Failed to get display settings heatmap', { error: error as Error });
		throw error;
	}
}

function sendRequestByProvider(
	type: DataProvider,
	req: IGetHeatmapCryptoRequest,
): Promise<IHeatmap> {
	const httpService = useHttpService();

	switch (type) {
		case DataProvider.Production:
			return httpService.get<IHeatmap>('https://gateway.planet9.uk/heatmap/settings', {
				query: {
					timeRange: req.timeRange,
				},
			});
		case DataProvider.MockLocal:
			return getMockData();
		case DataProvider.MockServer:
			return httpService.get<IHeatmap>('/api/heatmap/settings', {
				query: {
					timeRange: req.timeRange,
				},
			});
		default:
			return getMockData();
	}
}

const { getMock } = useFetchMock<IHeatmapItem[]>('/mock/heatmap/forex.json');

async function getMockData(): Promise<IHeatmap> {
	return {
		items: await getMock(),
	};
}

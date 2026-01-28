import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/monitoring';
import type { ITreemap, ITreemapItem } from '../model';
import { useFetchMock } from '@/shared/mock';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}

const dataProvider = DataProvider.MockLocal;

interface IGetHeatMapRequest {
	excludeTickers: string[];
}

export async function getHeatmapCrypto(req: IGetHeatMapRequest): Promise<ITreemap | null> {
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
	req: IGetHeatMapRequest,
): Promise<ITreemap> {
	const httpService = useHttpService();

	const preparedTickers = req.excludeTickers.join(',');

	switch (type) {
		case DataProvider.Production:
			return httpService.get<ITreemap>('https://gateway.planet9.uk/heatmap/settings', {
				query: {
					excludeTickers: preparedTickers,
				},
			});
		case DataProvider.MockLocal:
			return getMockData();
		case DataProvider.MockServer:
			return httpService.get<ITreemap>('/api/heatmap/settings', {
				query: {
					excludeTickers: preparedTickers,
				},
			});
		default:
			return getMockData();
	}
}

const { getMock } = useFetchMock<ITreemapItem[]>('/mock/heatmap/crypto.json');

async function getMockData(): Promise<ITreemap> {
	return {
		items: await getMock(),
		currencySymbol: '$',
	};
}

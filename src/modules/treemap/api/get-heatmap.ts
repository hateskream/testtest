import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import type { ITreemap, ITreemapItem } from '../model';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}

const dataProvider = DataProvider.MockLocal;

interface IGetHeatMapRequest {
	market: string;
	excludeTickers: string[];
}

export async function getHeatmap(req: IGetHeatMapRequest): Promise<ITreemap | null> {
	const logger = useLogger();

	try {
		const response = await sendRequestByProvider(dataProvider, req);

		return response;
	} catch (error) {
		logger.error('Failed to get display settings heatmap', error as Error);
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
					market: req.market,
					excludeTickers: preparedTickers,
				},
			});
		case DataProvider.MockLocal:
			return getMockData();
		case DataProvider.MockServer:
			return httpService.get<ITreemap>('/api/heatmap/settings', {
				query: {
					market: req.market,
					excludeTickers: preparedTickers,
				},
			});
		default:
			return getMockData();
	}
}

async function getMockData(): Promise<ITreemap> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});


	const items: ITreemapItem[] = [
		{
			ticker: 'BTC',
			name: 'Bitcoin',
			logoSrc: 'https://upload.wikimedia.org/wikipedia/commons/9/9a/BTC_Logo.svg',
			values: {
				marketCap: 100000,
				change24hPercent11: 0.1,
				price: 1000,
			},
		},
	];

	return {
		items: items,
		currencySymbol: '$',
	};
}

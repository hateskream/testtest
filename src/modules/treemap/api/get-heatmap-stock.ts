import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import type { ITreemap, ITreemapItem } from '../model';

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

async function getMockData(): Promise<ITreemap> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	const item1: ITreemapItem = {
		ticker: 'BTC',
		name: 'Bitcoin',
		logoSrc: '',
		values: {
			marketCap: 100000,
			volume: 100000,
			change24hPercent: 0.2,
			change24h: 30000,
			price: 30000,
			industries: 'Industries 1234',
			sector: 'Sector 1234',
			country: 'Country 1234',
			['industries-marketCap']: 1,
			['industries-volume']: 1,
			['sector-marketCap']: 1,
			['sector-volume']: 1,
			['country-marketCap']: 1,
			['country-volume']: 1,
		},
	};

	const item2: ITreemapItem = {
		ticker: 'BTC1',
		name: 'Bitcoin',
		logoSrc: '',
		values: {
			marketCap: 100000,
			volume: 100000,
			change24hPercent: 0.2,
			change24h: 30000,
			price: 30000,
			industries: 'Industries 12341',
			sector: 'Sector 12341',
			country: 'Country 12341',
			['industries-marketCap']: 1,
			['industries-volume']: 1,
			['sector-marketCap']: 1,
			['sector-volume']: 1,
			['country-marketCap']: 1,
			['country-volume']: 1,
		},
	};

	const item3: ITreemapItem = {
		ticker: 'BTC11',
		name: 'Bitcoin',
		logoSrc: '',
		values: {
			marketCap: 100000,
			volume: 100000,
			change24hPercent: 0.2,
			change24h: 30000,
			price: 30000,
			industries: 'Industries 123411',
			sector: 'Sector 123411',
			country: 'Country 123411',
			['industries-marketCap']: 1,
			['industries-volume']: 1,
			['sector-marketCap']: 1,
			['sector-volume']: 1,
			['country-marketCap']: 1,
			['country-volume']: 1,
		},
	};

	return {
		items: [item1, item2, item3],
		currencySymbol: '$',
	};
}

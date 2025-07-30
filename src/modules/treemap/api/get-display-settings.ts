import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import type { IDisplaySettings } from '../model';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}

const dataProvider = DataProvider.MockLocal;

export async function getDisplaySettings(): Promise<IDisplaySettings[] | null> {
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
): Promise<IDisplaySettings[]> {
	const httpService = useHttpService();

	switch (type) {
		case DataProvider.Production:
			return httpService.get<IDisplaySettings[]>('https://gateway.planet9.uk/heatmap/settings');
		case DataProvider.MockLocal:
			return getMockData();
		case DataProvider.MockServer:
			return httpService.get<IDisplaySettings[]>('/api/heatmap/settings');
		default:
			return getMockData();
	}
}

const crypto: IDisplaySettings = {
	market: {
		id: 'crypto',
		displayName: 'Crypto',
	},
	sizeBy: [
		{ key: 'marketCap', displayName: 'Market cap 333', isPercent: false },
	],
	colorBy: [
		{
			colorBy: { key: 'change24hPercent11', displayName: 'Change 24h %11', isPercent: true },
			colorDepth: [
				{ start: -3, end: 3, id: 'negative3' },
			],
		},
	],
	displayValue: [
		{ key: 'marketCap 444', displayName: 'Market cap 444', isPercent: false },
	],
};

const stock: IDisplaySettings = {
	market: {
		id: 'stock',
		displayName: 'Stocks',
	},
	sizeBy: [
		{ key: 'marketCap3', displayName: 'Market cap3', isPercent: false },
		{ key: 'marketCap1', displayName: 'Market cap1', isPercent: false },
		{ key: 'marketCap2', displayName: 'Market cap2', isPercent: false },
	],
	colorBy: [
		{
			colorBy: { key: 'change24hPercent', displayName: 'Change 24h %', isPercent: true },
			colorDepth: [
				{ start: -3, end: 3, id: 'negative13' },
				{ start: -4, end: 4, id: 'negative31' },
			],
		},
		{
			colorBy: { key: 'change24hPercent1', displayName: 'Change 24h %1', isPercent: true },
			colorDepth: [
				{ start: -3, end: 3, id: 'negative21' },
				{ start: -433, end: 433, id: 'negative32' },
			],
		},
	],
	displayValue: [
		{ key: 'marketCap 0', displayName: 'Market cap 0', isPercent: false },
	],
};

async function getMockData(): Promise<IDisplaySettings[]> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	return [
		crypto,
		stock,
	];
}

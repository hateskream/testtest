import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import { NO_GROUP, type IDisplaySettings } from '../model';

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
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
		{ key: 'volume', displayName: 'Volume', isPercent: false },
	],
	colorBy: [
		{
			colorBy:
				{ key: 'change24hPercent', displayName: 'Change 24h, %', isPercent: true },
			colorDepth: [
				{ start: -0.6, end: 0.6, id: '0.6-change24hPercent' },
				{ start: -3, end: 3, id: '3-change24hPercent' },
				{ start: -6, end: 6, id: '6-change24hPercent' },
				{ start: -15, end: 15, id: '15-change24hPercent' },
				{ start: -30, end: 30, id: '30-change24hPercent' },
			],
		},
		{
			colorBy:
				{ key: 'change24h', displayName: 'Change 24h', isPercent: false },
			colorDepth: [
				{ start: -0.6, end: 0.6, id: '0.6-change24h' },
				{ start: -3, end: 3, id: '3-change24h' },
				{ start: -6, end: 6, id: '6-change24h' },
				{ start: -15, end: 15, id: '15-change24h' },
				{ start: -30, end: 30, id: '30-change24h' },
			],
		},
	],
	displayValue: [
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
		{ key: 'volume', displayName: 'Volume', isPercent: false },
		{ key: 'change24h', displayName: 'Change 24h', isPercent: false },
		{ key: 'change24hPercent', displayName: 'Change 24h, %', isPercent: true },
		{ key: 'price', displayName: 'Price', isPercent: false },
	],
};

const stock: IDisplaySettings = {
	market: {
		id: 'stock',
		displayName: 'Stock',
	},
	sizeBy: [
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
		{ key: 'volume', displayName: 'Volume', isPercent: false },
	],
	colorBy: [
		{
			colorBy:
				{ key: 'change24hPercent', displayName: 'Change 24h, %', isPercent: true },
			colorDepth: [
				{ start: -0.6, end: 0.6, id: '0.6-change24hPercent' },
				{ start: -3, end: 3, id: '3-change24hPercent' },
				{ start: -6, end: 6, id: '6-change24hPercent' },
				{ start: -15, end: 15, id: '15-change24hPercent' },
				{ start: -30, end: 30, id: '30-change24hPercent' },
			],
		},
		{
			colorBy:
				{ key: 'change24h', displayName: 'Change 24h', isPercent: false },
			colorDepth: [
				{ start: -0.6, end: 0.6, id: '0.6-change24h' },
				{ start: -3, end: 3, id: '3-change24h' },
				{ start: -6, end: 6, id: '6-change24h' },
				{ start: -15, end: 15, id: '15-change24h' },
				{ start: -30, end: 30, id: '30-change24h' },
			],
		},
	],
	displayValue: [
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
		{ key: 'volume', displayName: 'Volume', isPercent: false },
		{ key: 'change24h', displayName: 'Change 24h', isPercent: false },
		{ key: 'change24hPercent', displayName: 'Change 24h, %', isPercent: true },
		{ key: 'price', displayName: 'Price', isPercent: false },
	],
	groupBy: [
		{ key: 'industries', displayName: 'Industries', isPercent: false },
		{ key: 'sector', displayName: 'Sector', isPercent: false },
		{ key: 'country', displayName: 'Country', isPercent: false },
		NO_GROUP,
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

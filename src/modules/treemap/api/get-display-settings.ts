import { useHttpService } from '@/shared/service/http-service';
import { useLogger } from '@/shared/service/logger';
import type { IDisplaySettings, IDisplaySettingsByMarket } from '../model';

enum DataProvider {
	Production,
	MockLocal,
	MockServer,
}

const dataProvider = DataProvider.MockLocal;

export async function getDisplaySettings(): Promise<IDisplaySettingsByMarket | null> {
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
): Promise<IDisplaySettingsByMarket> {
	const httpService = useHttpService();

	switch (type) {
		case DataProvider.Production:
			return httpService.get<IDisplaySettingsByMarket>('https://gateway.planet9.uk/heatmap/settings');
		case DataProvider.MockLocal:
			return getMockData();
		case DataProvider.MockServer:
			return httpService.get<IDisplaySettingsByMarket>('/api/heatmap/settings');
		default:
			return getMockData();
	}
}

const crypto: IDisplaySettings = {
	sizeBy: [
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
	],
	colorBy: [
		{
			colorBy: { key: 'change24hPercent', displayName: 'Change 24h %', isPercent: true },
			colorDepth: [
				{ start: -3, end: 3 },
			],
		},
	],
	displayValue: [
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
	],
};

const stock: IDisplaySettings = {
	sizeBy: [
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
	],
	colorBy: [
		{
			colorBy: { key: 'change24hPercent', displayName: 'Change 24h %', isPercent: true },
			colorDepth: [
				{ start: -3, end: 3 },
			],
		},
	],
	displayValue: [
		{ key: 'marketCap', displayName: 'Market cap', isPercent: false },
	],
};

async function getMockData(): Promise<IDisplaySettingsByMarket> {
	await new Promise(resolve => {
		setTimeout(resolve, 0);
	});

	return {
		crypto,
		stock,
	};
}

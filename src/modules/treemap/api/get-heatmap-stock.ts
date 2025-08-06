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

	// const item1: ITreemapItem = {
	// 	ticker: 'BTC',
	// 	name: 'Bitcoin',
	// 	logoSrc: '',
	// 	values: {
	// 		marketCap: 100000,
	// 		volume: 100000,
	// 		change24hPercent: 0.2,
	// 		change24h: 30000,
	// 		price: 30000,
	// 		industries: 'Industries 1234',
	// 		sector: 'Sector 1234',
	// 		country: 'Country 1234',
	// 		['industries-marketCap']: 1,
	// 		['industries-volume']: 1,
	// 		['sector-marketCap']: 1,
	// 		['sector-volume']: 1,
	// 		['country-marketCap']: 1,
	// 		['country-volume']: 1,
	// 	},
	// };

	// const item2: ITreemapItem = {
	// 	ticker: 'BTC1',
	// 	name: 'Bitcoin',
	// 	logoSrc: '',
	// 	values: {
	// 		marketCap: 100000,
	// 		volume: 100000,
	// 		change24hPercent: 0.2,
	// 		change24h: 30000,
	// 		price: 30000,
	// 		industries: 'Industries 12341',
	// 		sector: 'Sector 12341',
	// 		country: 'Country 12341',
	// 		['industries-marketCap']: 1,
	// 		['industries-volume']: 1,
	// 		['sector-marketCap']: 1,
	// 		['sector-volume']: 1,
	// 		['country-marketCap']: 1,
	// 		['country-volume']: 1,
	// 	},
	// };

	// const item3: ITreemapItem = {
	// 	ticker: 'BTC11',
	// 	name: 'Bitcoin',
	// 	logoSrc: '',
	// 	values: {
	// 		marketCap: 100000,
	// 		volume: 100000,
	// 		change24hPercent: 0.2,
	// 		change24h: 30000,
	// 		price: 30000,
	// 		industries: 'Industries 123411',
	// 		sector: 'Sector 123411',
	// 		country: 'Country 123411',
	// 		['industries-marketCap']: 1,
	// 		['industries-volume']: 1,
	// 		['sector-marketCap']: 1,
	// 		['sector-volume']: 1,
	// 		['country-marketCap']: 1,
	// 		['country-volume']: 1,
	// 	},
	// };

	function getRandom(min: number, max: number): number {
		return parseFloat((Math.random() * (max - min) + min).toFixed(2));
	}

	function getRandomInt(min: number, max: number): number {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	const baseNames = ['Bitcoin', 'Ethereum', 'Solana', 'Cardano', 'Polkadot', 'Chainlink', 'Litecoin'];
	const sectors = ['Technology', 'Finance', 'Blockchain', 'DeFi', 'Web3', 'Infrastructure'];
	const countries = ['USA', 'Switzerland', 'Singapore', 'Germany', 'Japan', 'UK', 'Canada'];
	const industries = ['Cryptocurrency', 'Smart Contracts', 'Payments', 'NFTs', 'Stablecoins', 'Privacy'];

	const items: ITreemapItem[] = [];

	for (let i = 1; i <= 1000; i++) {
		const suffix = `ID${getRandomInt(0, 1000)}`;
		const ticker = `BTC${i} ${suffix}`;
		const name = baseNames[getRandomInt(0, baseNames.length - 1) + 1] + ' ' + suffix;

		const price = getRandom(10, 70000);
		const change24hPercent = getRandom(-15, 15);
		const change24h = parseFloat((price * change24hPercent / 100).toFixed(2));
		const marketCap = getRandom(1_000_000_000, 1_000_000_000_000); // 1B - 1T
		const volume = parseFloat((marketCap * getRandom(0.1, 0.5)).toFixed(2));

		const item: ITreemapItem = {
			ticker,
			name,
			logoSrc: '',
			values: {
				marketCap,
				volume,
				change24hPercent,
				change24h,
				price,
				industries: industries[getRandomInt(0, industries.length - 1)],
				sector: sectors[getRandomInt(0, sectors.length - 1)],
				country: countries[getRandomInt(0, countries.length - 1)],
				'industries-marketCap': getRandom(1, 50),
				'industries-volume': getRandom(0.5, 3),
				'sector-marketCap': getRandom(0.5, 3),
				'sector-volume': getRandom(0.5, 3),
				'country-marketCap': getRandom(0.5, 3),
				'country-volume': getRandom(0.5, 3),
			},
		};

		items.push(item);
	}

	return {
		items,
		currencySymbol: '$',
	};
}

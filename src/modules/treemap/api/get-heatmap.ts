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

	return {
		items: generateCryptoItems(600),
		currencySymbol: '$',
	};
}

function generateCryptoItems(count: number): ITreemapItem[] {
	const items: ITreemapItem[] = [];

	const knownTickers = [
		'BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA', 'SHIB', 'DOT', 'MATIC',
		'LTC', 'UNI', 'LINK', 'TRX', 'AVAX', 'ATOM', 'NEAR', 'FIL', 'ICP', 'VET',
		'EOS', 'ALGO', 'XTZ', 'AAVE', 'MKR', 'COMP', 'SAND', 'MANA', 'THETA', 'GRT',
		'CRV', 'SNX', 'KSM', 'FLOW', 'AR', 'CHZ', 'ENJ', 'RUNE', 'CAKE', 'HBAR',
		'KLAY', 'ONE', 'DASH', 'ZEC', 'XMR', 'BAT', 'OMG', 'ZIL', 'STX', 'MINA',
		'CELO', 'GLMR', 'ASTR', 'ROSE', 'OAS', 'ACH', 'API3', 'BAL', 'BAND', 'BLZ',
		'CTSI', 'DIA', 'DNT', 'EGLD', 'ELON', 'FLUX', 'FRAX', 'FXS', 'GALA', 'HNT',
		'ICX', 'INJ', 'IOST', 'JST', 'KAVA', 'KEEP', 'KNC', 'LDO', 'LRC', 'NEXO',
		'OCEAN', 'ONG', 'ONT', 'PLA', 'QNT', 'QTUM', 'RARI', 'REEF', 'RSR', 'SKL',
		'SRM', 'STORJ', 'SUSHI', 'TEL', 'TFUEL', 'TOMO', 'TVK', 'UMA', 'VIDT',
		'WAVES', 'WRX', 'XEC', 'XNO', 'YFI', 'YGG', 'ZEN', 'ZRX', 'CVX', 'SPELL',
		'AXS', 'IMX', 'PEPE', 'APT', 'SEI', 'WLD', 'FET', 'ARKM', 'JUP', 'BONK',
		'NOT', 'MEW', 'POPCAT', 'BEAM', 'HONEY', 'MYRO', 'SUN', 'SLP', 'TLM', 'TUSC',
	];

	// Генерация уникальных тикеров, если нужно больше 500
	const allTickers = new Set<string>(knownTickers);
	let id = 1;
	while (allTickers.size < count) {
		const fakeTicker = `CRYP${id}`;
		allTickers.add(fakeTicker);
		id++;
	}

	const tickerArray = Array.from(allTickers).slice(0, count);

	// Функция генерации случайных значений
	const generateValues = (): ITreemapItem['values'] => {
		// Определим шанс быть "крупной" криптой
		const isLargeCap = Math.random() < 0.05; // 5% шанс на large cap
		const isMidCap = Math.random() < 0.2; // 20% — mid
		const isLowCap = Math.random() < 0.5; // 50% — low

		let price: number;
		let marketCap: number;

		if (isLargeCap) {
			// Large cap: BTC, ETH уровни
			price = Math.random() < 0.1 ? (Math.random() * 10 + 1) : (Math.random() * 90000 + 1000);
			// eslint-disable-next-line @stylistic/max-len
			marketCap = Math.random() < 0.2 ? (Math.random() * 100_000_000_000 + 10_000_000_000) : (Math.random() * 1_000_000_000_000 + 50_000_000_000);
		} else if (isMidCap) {
			// Mid cap: 100M — 10B
			price = Math.random() * 10 + 0.01;
			marketCap = Math.random() * 9_900_000_000 + 100_000_000;
		} else if (isLowCap) {
			// Low cap: 10M — 100M
			price = Math.random() * 0.1 + 0.0001;
			marketCap = Math.random() * 90_000_000 + 10_000_000;
		} else {
			price = Math.random() < 0.7 ? (Math.random() * 0.0001 + 0.0000001) : (Math.random() * 5 + 0.01);
			marketCap = Math.random() * 10_000_000 + 100_000;
		}

		const volumeRatio = Math.random() * 0.8 + 0.05; // 5% — 85%
		const volume = marketCap * volumeRatio;

		const volatility = isLargeCap ? 5 : (isMidCap ? 15 : (Math.random() < 0.3 ? 100 : 50));
		const change24hPercent = parseFloat(((Math.random() * 2 - 1) * volatility).toFixed(2)); // -100% до +100%
		const change24h = (price * change24hPercent) / 100;

		return {
			marketCap: Math.round(marketCap),
			volume: Math.round(volume),
			change24hPercent,
			change24h: parseFloat(change24h.toFixed(8)),
			price: parseFloat(price.toFixed(8)),
		};
	};

	for (let i = 0; i < count; i++) {
		const ticker = tickerArray[i];
		const name = ticker.startsWith('CRYP') ? `${ticker} Token` : getFullName(ticker) || `${ticker} Coin`;

		items.push({
			ticker,
			name,
			logoSrc: '',
			values: generateValues(),
		});
	}

	return items;
};

function getFullName(ticker: string): string | null {
	const names: Record<string, string> = {
		BTC: 'Bitcoin',
		ETH: 'Ethereum',
		BNB: 'Binance Coin',
		SOL: 'Solana',
		XRP: 'XRP',
		DOGE: 'Dogecoin',
		ADA: 'Cardano',
		SHIB: 'Shiba Inu',
		DOT: 'Polkadot',
		MATIC: 'Polygon',
		PEPE: 'Pepe',
		BONK: 'Bonk',
		APT: 'Aptos',
		SUI: 'Sui',
		WLD: 'Worldcoin',
		FET: 'Fetch.ai',
		ARKM: 'Arkham',
		JUP: 'Jupiter',
	};
	return names[ticker] || null;
}

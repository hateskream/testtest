import { CellType } from '@/modules/widgets/widget-table';
import { MarketType } from '../model/exchanges.ts';

const cexMockData = [
	{
		id: 'binance',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'Binance',
				value: 'Binance',
			},
			vol24h: {
				value: '22631.30',
				magnitude: 'BTC',
			},
			volNorm24h: {
				value: '87631.30',
				magnitude: 'BTC',
			},
			coins: {
				value: '504',
			},
			pairs: {
				value: '1463',
			},
			country: {
				value: 'Cayman Islands',
			},
			launched: {
				value: '2017',
			},
			incentive: {
				value: 'x',
			},
			rank: {
				value: '1',
			},
			trustScore: {
				value: '10',
			},
		},
	},
	{
		id: 'bybit',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'Bybit',
				value: 'Bybit',
			},
			vol24h: {
				value: '3930.24',
				magnitude: 'BTC',
			},
			volNorm24h: {
				value: '2930.24',
				magnitude: 'BTC',
			},
			coins: {
				value: '386',
			},
			pairs: {
				value: '1357',
			},
			country: {
				value: 'British Virgin Islands',
			},
			launched: {
				value: '2018',
			},
			incentive: {
				value: 'Cell',
			},
			rank: {
				value: '2',
			},
			trustScore: {
				value: '9',
			},
		},
	},
	{
		id: 'coinbase',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'Coinbase',
				value: 'Coinbase',
			},
			vol24h: {
				value: '12592.23',
				magnitude: 'BTC',
			},
			volNorm24h: {
				value: '6592.23',
				magnitude: 'BTC',
			},
			coins: {
				value: '441',
			},
			pairs: {
				value: '1001',
			},
			country: {
				value: 'United States',
			},
			launched: {
				value: '2021',
			},
			incentive: {
				value: 'x',
			},
			rank: {
				value: '3',
			},
			trustScore: {
				value: '7',
			},
		},
	},
	{
		id: 'upbit',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'Upbit',
				value: 'Upbit',
			},
			vol24h: {
				value: '1946.24',
				magnitude: 'BTC',
			},
			volNorm24h: {
				value: '1346.24',
				magnitude: 'BTC',
			},
			coins: {
				value: '503',
			},
			pairs: {
				value: '827',
			},
			country: {
				value: 'Cayman Islands',
			},
			launched: {
				value: '2023',
			},
			incentive: {
				value: 'v',
			},
			rank: {
				value: '4',
			},
			trustScore: {
				value: '4',
			},
		},
	},
	{
		id: 'okx',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'OKX',
				value: 'OKX',
			},
			vol24h: {
				value: '4467.0',
				magnitude: 'BTC',
			},
			volNorm24h: {
				value: '3467.0',
				magnitude: 'BTC',
			},
			coins: {
				value: '1027',
			},
			pairs: {
				value: '1983',
			},
			country: {
				value: 'United States',
			},
			launched: {
				value: '2021',
			},
			incentive: {
				value: 'x',
			},
			rank: {
				value: '5',
			},
			trustScore: {
				value: '2',
			},
		},
	},
];

const dexMockData = [
	{
		id: 'pancakeswap',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'PancakeSwap v3',
				value: 'PancakeSwap v3',
			},
			vol24h: {
				value: '22631.30',
				magnitude: 'BTC',
			},
			volNorm24h: {
				value: '87631.30',
				magnitude: 'BTC',
			},
			launched: {
				value: '2017',
			},
			incentive: {
				value: 'x',
			},
			rank: {
				value: '1',
			},
			trustScore: {
				value: '10',
			},
		},
	},
	{
		id: 'raydium',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'Raydium',
				value: 'Raydium',
			},
			vol24h: {
				value: '3930.24',
				magnitude: 'BTC',
			},
			volNorm24h: {
				value: '2930.24',
				magnitude: 'BTC',
			},
			launched: {
				value: '2018',
			},
			incentive: {
				value: 'x',
			},
			rank: {
				value: '2',
			},
			trustScore: {
				value: '9',
			},
		},
	},
	{
		id: 'uniswap',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'Uniswap v2',
				value: 'Uniswap v2',
			},
			vol24h: {
				value: '12592.23',
				magnitude: 'BTC',
			},
			volNorm24h: {
				value: '6592.23',
				magnitude: 'BTC',
			},
			launched: {
				value: '2021',
			},
			incentive: {
				value: 'x',
			},
			rank: {
				value: '3',
			},
			trustScore: {
				value: '7',
			},
		},
	},
	{
		id: 'curve',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'Curve',
				value: 'Curve',
			},
			vol24h: {
				value: '1946.24',
				magnitude: 'BTC',
			},
			volNorm24h: {
				value: '1346.24',
				magnitude: 'BTC',
			},
			launched: {
				value: '2023',
			},
			incentive: {
				value: 'v',
			},
			rank: {
				value: '4',
			},
			trustScore: {
				value: '4',
			},
		},
	},
	{
		id: 'orca',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/dollar.png',
				ticker: 'Orca',
				value: 'Orca',
			},
			vol24h: {
				value: '4467.0',
				magnitude: 'BTC',
			},
			volNorm24h: {
				value: '3467.0',
				magnitude: 'BTC',
			},
			launched: {
				value: '2021',
			},
			incentive: {
				value: 'x',
			},
			rank: {
				value: '5',
			},
			trustScore: {
				value: '2',
			},
		},
	},
];

const cexColumns = [
	{
		key: 'exchange',
		label: 'Exchanges',
		shortLabel: 'Exchanges',
		position: 0,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.SYMBOL,
		group: { name: 'Exchange', displayName: 'Exchange' },
	},
	{
		key: 'vol24h',
		label: 'Vol. 24h',
		shortLabel: 'Vol. 24h',
		position: 1,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Volume', displayName: 'Volume' },
	},
	{
		key: 'volNorm24h',
		label: 'Vol norm. 24h',
		shortLabel: 'Vol norm. 24h',
		position: 2,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Volume', displayName: 'Volume' },
	},
	{
		key: 'coins',
		label: 'Coins',
		shortLabel: 'Coins',
		position: 3,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Trading', displayName: 'Trading' },
	},
	{
		key: 'pairs',
		label: 'Pairs',
		shortLabel: 'Pairs',
		position: 4,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Trading', displayName: 'Trading' },
	},
	{
		key: 'country',
		label: 'Country',
		shortLabel: 'Country',
		position: 5,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Info', displayName: 'Info' },
	},
	{
		key: 'launched',
		label: 'Launched',
		shortLabel: 'Launched',
		position: 6,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Info', displayName: 'Info' },
	},
	{
		key: 'incentive',
		label: 'Incentive',
		shortLabel: 'Incentive',
		position: 7,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Info', displayName: 'Info' },
	},
	{
		key: 'rank',
		label: 'Rank',
		shortLabel: 'Rank',
		position: 8,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Rating', displayName: 'Rating' },
	},
	{
		key: 'trustScore',
		label: 'Trust score',
		shortLabel: 'Trust score',
		position: 9,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Rating', displayName: 'Rating' },
	},
];

const dexColumns = [
	{
		key: 'exchange',
		label: 'Exchanges',
		shortLabel: 'Exchanges',
		position: 0,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.SYMBOL,
		group: { name: 'Exchange', displayName: 'Exchange' },
	},
	{
		key: 'vol24h',
		label: 'Vol. 24h',
		shortLabel: 'Vol. 24h',
		position: 1,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Volume', displayName: 'Volume' },
	},
	{
		key: 'volNorm24h',
		label: 'Vol norm. 24h',
		shortLabel: 'Vol norm. 24h',
		position: 2,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Volume', displayName: 'Volume' },
	},
	{
		key: 'launched',
		label: 'Launched',
		shortLabel: 'Launched',
		position: 3,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Info', displayName: 'Info' },
	},
	{
		key: 'incentive',
		label: 'Incentive',
		shortLabel: 'Incentive',
		position: 4,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Info', displayName: 'Info' },
	},
	{
		key: 'rank',
		label: 'Rank',
		shortLabel: 'Rank',
		position: 5,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Rating', displayName: 'Rating' },
	},
	{
		key: 'trustScore',
		label: 'Trust score',
		shortLabel: 'Trust score',
		position: 6,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.NUMBER,
		group: { name: 'Rating', displayName: 'Rating' },
	},
];

const stockMockData = [
	{
		id: 'amex',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/usa.png',
				ticker: 'AMEX',
				value: 'American Express',
			},
			marketHours: {
				value: '14:30 - 21:00',
			},
			mh: {
				value: '14:30 - 21:00',
			},
			exchangeTimezone: {
				value: 'UTC -4',
			},
			now: {
				value: 'Closed 🌙',
			},
			nextClosedDay: {
				value: 'Jun 19, 2025 Juneteenth',
			},
		},
	},
	{
		id: 'nasdaq',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/usa.png',
				ticker: 'NASDAQ',
				value: 'National Association',
			},
			marketHours: {
				value: '09:30 - 16:00',
			},
			mh: {
				value: '03:00, 19:30',
			},
			exchangeTimezone: {
				value: 'UTC -4',
			},
			now: {
				value: 'Open',
			},
			nextClosedDay: {
				value: 'Jun 14, 2025 Saturday',
			},
		},
	},
	{
		id: 'nyse',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/usa.png',
				ticker: 'NYSE',
				value: 'New York Stock Exchange',
			},
			marketHours: {
				value: '09:30 - 16:00',
			},
			mh: {
				value: '09:30 - 16:00',
			},
			exchangeTimezone: {
				value: 'UTC -4',
			},
			now: {
				value: 'Closed 🌙',
			},
			nextClosedDay: {
				value: 'Jun 21, 2025 Weekend',
			},
		},
	},
	{
		id: 'lse',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/uk.png',
				ticker: 'LSE',
				value: 'London Stock Exchange',
			},
			marketHours: {
				value: '08:00 - 16:30',
			},
			mh: {
				value: '08:00 - 16:30',
			},
			exchangeTimezone: {
				value: 'UTC +0',
			},
			now: {
				value: 'Open',
			},
			nextClosedDay: {
				value: 'Jun 15, 2025 Sunday',
			},
		},
	},
	{
		id: 'tse',
		data: {
			exchange: {
				cellType: 'Symbol',
				columnType: 'symbol',
				symbolType: 'Index',
				srcImg: '/flags/japan.png',
				ticker: 'TSE',
				value: 'Tokyo Stock Exchange',
			},
			marketHours: {
				value: '09:00 - 15:00',
			},
			mh: {
				value: '09:00 - 11:30, 12:30 - 15:00',
			},
			exchangeTimezone: {
				value: 'UTC +9',
			},
			now: {
				value: 'Closed 🌙',
			},
			nextClosedDay: {
				value: 'Jun 22, 2025 Holiday',
			},
		},
	},
];

const stockColumns = [
	{
		key: 'exchange',
		label: 'Exchanges',
		shortLabel: 'Exchanges',
		position: 0,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.SYMBOL,
		group: { name: 'Exchange', displayName: 'Exchange' },
	},
	{
		key: 'marketHours',
		label: 'Market hours = UTC -4',
		shortLabel: 'Market hours',
		position: 1,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Time', displayName: 'Time' },
	},
	{
		key: 'mh',
		label: 'MH',
		shortLabel: 'MH',
		position: 2,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Time', displayName: 'Time' },
	},
	{
		key: 'exchangeTimezone',
		label: 'Exchange timezone',
		shortLabel: 'Timezone',
		position: 3,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Time', displayName: 'Time' },
	},
	{
		key: 'now',
		label: 'Now',
		shortLabel: 'Now',
		position: 4,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Status', displayName: 'Status' },
	},
	{
		key: 'nextClosedDay',
		label: 'Next closed day',
		shortLabel: 'Next closed',
		position: 5,
		sortable: false,
		draggable: false,
		visible: true,
		type: CellType.TEXT,
		group: { name: 'Status', displayName: 'Status' },
	},
];


export const getGenericColumns = (market: MarketType, cexDex: 'CEX' | 'DEX') => {
	if (market === MarketType.Crypto) {
		return stockColumns;
	}
	return cexDex === 'CEX' ? cexColumns : dexColumns;
};

export const getGenericRows = (market: MarketType, cexDex: 'CEX' | 'DEX') => {
	if (market === MarketType.Stock) {
		return stockMockData;
	}
	return cexDex === 'CEX' ? cexMockData : dexMockData;
};

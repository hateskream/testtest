import { CellType, ColumnType, SymbolType } from '@/modules/cell';
import type { TickerDto } from '../../model';

export const mockTickers: TickerDto[] = [
	{
		tickerId: 'EURUSD',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			leftSrcImg: '',
			rightSrcImg: '',
			leftTicker: 'EUR',
			rightTicker: 'USD',
		},
	},
	{
		tickerId: 'GBPUSD',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			leftSrcImg: '',
			rightSrcImg: '',
			leftTicker: 'GBP',
			rightTicker: 'USD',
		},
	},
	{
		tickerId: 'USDJPY',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			leftSrcImg: '',
			rightSrcImg: '',
			leftTicker: 'USD',
			rightTicker: 'JPY',
		},
	},
	{
		tickerId: 'AUDUSD',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			leftSrcImg: '',
			rightSrcImg: '',
			leftTicker: 'AUD',
			rightTicker: 'USD',
		},
	},
	{
		tickerId: 'USDCAD',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			leftSrcImg: '',
			rightSrcImg: '',
			leftTicker: 'USD',
			rightTicker: 'CAD',
		},
	},
	{
		tickerId: 'CHFJPY',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			leftSrcImg: '',
			rightSrcImg: '',
			leftTicker: 'CHF',
			rightTicker: 'JPY',
		},
	},
	{
		tickerId: 'EURGBP',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			leftSrcImg: '',
			rightSrcImg: '',
			leftTicker: 'EUR',
			rightTicker: 'GBP',
		},
	},
	{
		tickerId: 'EURJPY',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			leftSrcImg: '',
			rightSrcImg: '',
			leftTicker: 'EUR',
			rightTicker: 'JPY',
		},
	},
	{
		tickerId: 'NZDUSD',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			leftSrcImg: '',
			rightSrcImg: '',
			leftTicker: 'NZD',
			rightTicker: 'USD',
		},
	},
	{
		tickerId: 'XAUUSD',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Forex,
			leftSrcImg: '',
			rightSrcImg: '',
			leftTicker: 'XAU',
			rightTicker: 'USD',
		},
	},
	{
		tickerId: 'TSLA',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '1',
			ticker: 'TSLA',
			companyName: 'Tesla,Inc.',
		},
	},
	{
		tickerId: 'AAPL',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '2',
			ticker: 'AAPL',
			companyName: 'Apple Inc.',
		},

	},
	{
		tickerId: 'MSFT',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '3',
			ticker: 'MSFT',
			companyName: 'Microsoft Corporation',
		},
	},
	{
		tickerId: 'NVDA',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '4',
			ticker: 'NVDA',
			companyName: 'NVIDIA Corporation',
		},
	},
	{
		tickerId: 'GOOGL',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '5',
			ticker: 'GOOGL',
			companyName: 'Alphabet Inc.',
		},
	},
	{
		tickerId: 'AMZN',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '6',
			ticker: 'AMZN',
			companyName: 'Amazon.com Inc.',
		},
	},
	{
		tickerId: 'META',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '7',
			ticker: 'META',
			companyName: 'Meta Platforms Inc.',
		},
	},
	{
		tickerId: 'BRK.B',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '8',
			ticker: 'BRK.B',
			companyName: 'Berkshire Hathaway Inc.',
		},
	},
	{
		tickerId: 'JPM',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '9',
			ticker: 'JPM',
			companyName: 'JPMorgan Chase & Co.',
		},
	},
	{
		tickerId: 'UNH',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Stock,
			srcImg: '10',
			ticker: 'UNH',
			companyName: 'UnitedHealth Group Inc.',
		},
	},
	{
		tickerId: 'SPX',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '1',
			ticker: 'SPX',
			indexName: 'SPX',
		},

	},
	{
		tickerId: 'NDX',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '2',
			ticker: 'NDX',
			indexName: 'NDX',
		},

	},
	{
		tickerId: 'DJI',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '3',
			ticker: 'DJI',
			indexName: 'DJI',
		},

	},
	{
		tickerId: 'UKX',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '4',
			ticker: 'UKX',
			indexName: 'UKX',
		},

	},
	{
		tickerId: 'NKY',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '5',
			ticker: 'NKY',
			indexName: 'NKY',
		},

	},
	{
		tickerId: 'DAX',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '6',
			ticker: 'DAX',
			indexName: 'DAX',
		},
	},
	{
		tickerId: 'CAC',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '7',
			ticker: 'CAC',
			indexName: 'CAC',
		},

	},
	{
		tickerId: 'FTSE',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '8',
			ticker: 'FTSE',
			indexName: 'FTSE',
		},

	},
	{
		tickerId: 'SMI',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '9',
			ticker: 'SMI',
			indexName: 'SMI',
		},

	},
	{
		tickerId: 'ASX',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Index,
			srcImg: '10',
			ticker: 'ASX',
			indexName: 'ASX',
		},
	},
	{
		tickerId: 'BTC',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'BTC.png',
			ticker: 'BTC',
			blockchain: 'Bitcoin',
		},
	},
	{
		tickerId: 'ETH',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'ETH.png',
			ticker: 'ETH',
			blockchain: 'Ethereum',
		},
	},
	{
		tickerId: 'USDT',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'USDT.png',
			ticker: 'USDT',
			blockchain: 'Tether',
		},
	},
	{
		tickerId: 'BNB',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'BNB.png',
			ticker: 'BNB',
			blockchain: 'Binance Smart Chain',
		},
	},
	{
		tickerId: 'SOL',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'SOL.png',
			ticker: 'SOL',
			blockchain: 'Solana',
		},
	},
	{
		tickerId: 'XRP',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'XRP.png',
			ticker: 'XRP',
			blockchain: 'XRP Ledger',
		},
	},
	{
		tickerId: 'ADA',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'ADA.png',
			ticker: 'ADA',
			blockchain: 'Cardano',
		},
	},
	{
		tickerId: 'DOGE',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'DOGE.png',
			ticker: 'DOGE',
			blockchain: 'Dogecoin',
		},
	},
	{
		tickerId: 'AVAX',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'AVAX.png',
			ticker: 'AVAX',
			blockchain: 'Avalanche',
		},
	},
	{
		tickerId: 'LINK',
		[ColumnType.Symbol]: {
			cellType: CellType.Symbol,
			columnType: ColumnType.Symbol,
			symbolType: SymbolType.Crypto,
			srcImg: 'LINK.png',
			ticker: 'LINK',
			blockchain: 'Chainlink',
		},
	},
];

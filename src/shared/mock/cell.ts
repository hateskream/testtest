import {
	type Cell,
	CellType,
	ColumnType,
	createTickerId,
	type ICommoditySymbolCell,
	type ICryptoSymbolCell,
	type IForexSymbolCell,
	type IIndexSymbolCell,
	type IPlaneTextSymbolCell,
	type IStockSymbolCell,
	type ISymbolCell,
	Magnitude,
	type RowCells,
	Status,
	SymbolType,
	type TableRow,
	Trend,
	type ColumnWithoutSymbol,
	type ColumnToCell,
	type INumberCell,
	type IPercentCell,
	type IRangeCell,
} from '@/modules/cell';

const allCellByColumn: Record<ColumnWithoutSymbol, Cell> = 	{
	[ColumnType.PriceCurrent]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceCurrent,
		value: '45632',
		currencySymbol: '$',
		magnitude: Magnitude.NONE,
		trend: Trend.UP,
	},
	[ColumnType.PriceMin24h]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceMin24h,
		value: '44892',
		currencySymbol: '$',
		magnitude: Magnitude.NONE,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceMax24h]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceMax24h,
		value: '46120',
		currencySymbol: '$',
		magnitude: Magnitude.NONE,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceMin1y]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceMin1y,
		value: '15476',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceMax1y]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceMax1y,
		value: '73750',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceAvg50d]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceAvg50d,
		value: '42150',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceAvg200d]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceAvg200d,
		value: '38925',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceOpen]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceOpen,
		value: '45120',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.PriceClose]: {
		cellType: CellType.Number,
		columnType: ColumnType.PriceClose,
		value: '45632',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.Price1yRange]: {
		cellType: CellType.Range,
		columnType: ColumnType.Price1yRange,
		currencySymbol: '$',
		startValue: '15476',
		endValue: '73750',
		startMagnitude: Magnitude.THOUSAND,
		endMagnitude: Magnitude.THOUSAND,
	},
	[ColumnType.Price24hChart]: {
		cellType: CellType.SvgChart,
		columnType: ColumnType.Price24hChart,
		src: '/images/mock/chart-btc-24h.svg',
	},
	[ColumnType.Price7dChart]: {
		cellType: CellType.SvgChart,
		columnType: ColumnType.Price7dChart,
		src: '/images/mock/chart-btc-7d.svg',
	},
	[ColumnType.Price30dChart]: {
		cellType: CellType.SvgChart,
		columnType: ColumnType.Price30dChart,
		src: '/images/mock/chart-btc-30d.svg',
	},
	[ColumnType.ChangePrice24h]: {
		cellType: CellType.Number,
		columnType: ColumnType.ChangePrice24h,
		value: '511',
		currencySymbol: '$',
		magnitude: Magnitude.NONE,
		trend: Trend.UP,
	},
	[ColumnType.ChangePrice1hPercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.ChangePrice1hPercent,
		value: '12',
		trend: Trend.UP,
	},
	[ColumnType.ChangePrice24hPercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.ChangePrice24hPercent,
		value: '13',
		trend: Trend.UP,
	},
	[ColumnType.ChangePrice7dPercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.ChangePrice7dPercent,
		value: '25',
		trend: Trend.UP,
	},
	[ColumnType.ChangePrice30dPercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.ChangePrice30dPercent,
		value: '47',
		trend: Trend.UP,
	},
	[ColumnType.Volume24h]: {
		cellType: CellType.Number,
		columnType: ColumnType.Volume24h,
		value: '42',
		currencySymbol: '$',
		magnitude: Magnitude.BILLION,
		trend: Trend.UP,
	},
	[ColumnType.VolumeRel10d]: {
		cellType: CellType.Number,
		columnType: ColumnType.VolumeRel10d,
		value: '15',
		currencySymbol: '',
		magnitude: Magnitude.NONE,
		trend: Trend.UP,
	},
	[ColumnType.VolumeAvg10d]: {
		cellType: CellType.Number,
		columnType: ColumnType.VolumeAvg10d,
		value: '73',
		currencySymbol: '$',
		magnitude: Magnitude.BILLION,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.VolumeAvg50d]: {
		cellType: CellType.Number,
		columnType: ColumnType.VolumeAvg50d,
		value: '18',
		currencySymbol: '$',
		magnitude: Magnitude.BILLION,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.MarketCap24h]: {
		cellType: CellType.Number,
		columnType: ColumnType.MarketCap24h,
		value: '50',
		currencySymbol: '$',
		magnitude: Magnitude.BILLION,
		trend: Trend.UP,
	},
	[ColumnType.MarketCapRank]: {
		cellType: CellType.Text,
		columnType: ColumnType.MarketCapRank,
		value: '1',
	},
	[ColumnType.MarketCapFullyDiluted]: {
		cellType: CellType.Number,
		columnType: ColumnType.MarketCapFullyDiluted,
		value: '957',
		currencySymbol: '$',
		magnitude: Magnitude.BILLION,
		trend: Trend.UP,
	},
	[ColumnType.MarketCapChange24h]: {
		cellType: CellType.Number,
		columnType: ColumnType.MarketCapChange24h,
		value: '10',
		currencySymbol: '$',
		magnitude: Magnitude.BILLION,
		trend: Trend.UP,
	},
	[ColumnType.MarketCapChange24hPercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.MarketCapChange24hPercent,
		value: '13',
		trend: Trend.UP,
	},
	[ColumnType.CirculatingSupply]: {
		cellType: CellType.Number,
		columnType: ColumnType.CirculatingSupply,
		value: '65',
		currencySymbol: '',
		magnitude: Magnitude.MILLION,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.TotalSupply]: {
		cellType: CellType.Number,
		columnType: ColumnType.TotalSupply,
		value: '19',
		currencySymbol: '',
		magnitude: Magnitude.MILLION,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.MaxSupply]: {
		cellType: CellType.Number,
		columnType: ColumnType.MaxSupply,
		value: '21',
		currencySymbol: '',
		magnitude: Magnitude.MILLION,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.AllTimeHigh]: {
		cellType: CellType.Number,
		columnType: ColumnType.AllTimeHigh,
		value: '73750',
		currencySymbol: '$',
		magnitude: Magnitude.THOUSAND,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.AllTimeHighChangePercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.AllTimeHighChangePercent,
		value: '38',
		trend: Trend.DOWN,
	},
	[ColumnType.AllTimeHighDate]: {
		cellType: CellType.Text,
		columnType: ColumnType.AllTimeHighDate,
		value: '2021-11-10',
	},
	[ColumnType.AllTimeLow]: {
		cellType: CellType.Number,
		columnType: ColumnType.AllTimeLow,
		value: '81',
		currencySymbol: '$',
		magnitude: Magnitude.NONE,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.AllTimeLowChangePercent]: {
		cellType: CellType.Percent,
		columnType: ColumnType.AllTimeLowChangePercent,
		value: '81',
		trend: Trend.UP,
	},
	[ColumnType.AllTimeLowDate]: {
		cellType: CellType.Text,
		columnType: ColumnType.AllTimeLowDate,
		value: '2013-07-05',
	},
	[ColumnType.RSIValue]: {
		cellType: CellType.Number,
		columnType: ColumnType.RSIValue,
		value: '58',
		currencySymbol: '',
		magnitude: Magnitude.NONE,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.RSIChart]: {
		cellType: CellType.SvgChart,
		columnType: ColumnType.RSIChart,
		src: '/images/mock/rsi-btc.svg',
	},
	[ColumnType.Beta5y]: {
		cellType: CellType.Number,
		columnType: ColumnType.Beta5y,
		value: '23',
		currencySymbol: '',
		magnitude: Magnitude.NONE,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.LastDividend]: {
		cellType: CellType.Number,
		columnType: ColumnType.LastDividend,
		value: '54',
		currencySymbol: '$',
		magnitude: Magnitude.NONE,
		trend: Trend.NEUTRAL,
	},
	[ColumnType.Employees]: {
		cellType: CellType.Text,
		columnType: ColumnType.Employees,
		value: 'N/A',
	},
	[ColumnType.IpODate]: {
		cellType: CellType.Text,
		columnType: ColumnType.IpODate,
		value: '2009-01-03',
	},
	[ColumnType.Sector]: {
		cellType: CellType.Text,
		columnType: ColumnType.Sector,
		value: 'Cryptocurrency',
	},
	[ColumnType.Industry]: {
		cellType: CellType.Text,
		columnType: ColumnType.Industry,
		value: 'Digital Currency',
	},
	[ColumnType.Source]: {
		cellType: CellType.Text,
		columnType: ColumnType.Source,
		value: 'CoinGecko',
	},
	[ColumnType.ListingDate]: {
		cellType: CellType.Text,
		columnType: ColumnType.ListingDate,
		value: '2013-04-28',
	},
	[ColumnType.UpdateDate]: {
		cellType: CellType.Text,
		columnType: ColumnType.UpdateDate,
		value: '2024-01-15 10:30:15',
	},
	[ColumnType.Volatility]: {
		cellType: CellType.Label,
		columnType: ColumnType.Volatility,
		value: 'High',
		status: Status.CAUTION,
	},
};

interface ITickerData {
	left: string;
	right: string;
}

const allTickers: Record<SymbolType, ITickerData[]> = {
	[SymbolType.Crypto]: [
		{ left: 'BTC', right: 'Bitcoin' },
		{ left: 'ETH', right: 'Ethereum' },
		{ left: 'BNB', right: 'Binance Coin' },
		{ left: 'XRP', right: 'XRP (Ripple)' },
		{ left: 'ADA', right: 'Cardano' },
		{ left: 'SOL', right: 'Solana' },
		{ left: 'DOGE', right: 'Dogecoin' },
		{ left: 'DOT', right: 'Polkadot' },
		{ left: 'MATIC', right: 'Polygon' },
		{ left: 'LTC', right: 'Litecoin' },
		{ left: 'TRX', right: 'TRON' },
		{ left: 'SHIB', right: 'Shiba Inu' },
		{ left: 'AVAX', right: 'Avalanche' },
		{ left: 'UNI', right: 'Uniswap' },
		{ left: 'LINK', right: 'Chainlink' },
		{ left: 'XLM', right: 'Stellar' },
		{ left: 'ATOM', right: 'Cosmos' },
		{ left: 'ETC', right: 'Ethereum Classic' },
		{ left: 'TON', right: 'Toncoin' },
		{ left: 'XMR', right: 'Monero' },
		{ left: 'BCH', right: 'Bitcoin Cash' },
		{ left: 'APT', right: 'Aptos' },
		{ left: 'NEAR', right: 'NEAR Protocol' },
		{ left: 'QNT', right: 'Quant' },
		{ left: 'VET', right: 'VeChain' },
		{ left: 'FIL', right: 'Filecoin' },
		{ left: 'ALGO', right: 'Algorand' },
		{ left: 'HBAR', right: 'Hedera' },
		{ left: 'ICP', right: 'Internet Computer' },
		{ left: 'GRT', right: 'The Graph' },
		{ left: 'AAVE', right: 'Aave' },
		{ left: 'EOS', right: 'EOS' },
		{ left: 'SAND', right: 'The Sandbox' },
		{ left: 'MANA', right: 'Decentraland' },
		{ left: 'XTZ', right: 'Tezos' },
		{ left: 'AXS', right: 'Axie Infinity' },
		{ left: 'THETA', right: 'Theta' },
		{ left: 'FTM', right: 'Fantom' },
		{ left: 'EGLD', right: 'Elrond (MultiversX)' },
		{ left: 'KAVA', right: 'Kava' },
		{ left: 'RUNE', right: 'THORChain' },
		{ left: 'NEO', right: 'NEO' },
		{ left: 'FLOW', right: 'Flow' },
		{ left: 'ZEC', right: 'Zcash' },
		{ left: 'CHZ', right: 'Chiliz' },
		{ left: 'CRV', right: 'Curve DAO' },
		{ left: 'SNX', right: 'Synthetix' },
		{ left: '1INCH', right: '1inch' },
	],

	[SymbolType.Stock]: [
		{ left: 'AAPL', right: 'Apple Inc.' },
		{ left: 'MSFT', right: 'Microsoft Corporation' },
		{ left: 'GOOGL', right: 'Alphabet Inc. (Class A)' },
		{ left: 'AMZN', right: 'Amazon.com, Inc.' },
		{ left: 'TSLA', right: 'Tesla, Inc.' },
		{ left: 'META', right: 'Meta Platforms, Inc.' },
		{ left: 'NVDA', right: 'NVIDIA Corporation' },
		{ left: 'BRK.B', right: 'Berkshire Hathaway (Class B)' },
		{ left: 'JPM', right: 'JPMorgan Chase & Co.' },
		{ left: 'V', right: 'Visa Inc.' },
		{ left: 'JNJ', right: 'Johnson & Johnson' },
		{ left: 'PG', right: 'Procter & Gamble Co.' },
		{ left: 'UNH', right: 'UnitedHealth Group' },
		{ left: 'HD', right: 'Home Depot, Inc.' },
		{ left: 'MA', right: 'Mastercard Incorporated' },
		{ left: 'DIS', right: 'The Walt Disney Company' },
		{ left: 'BAC', right: 'Bank of America Corporation' },
		{ left: 'PFE', right: 'Pfizer Inc.' },
		{ left: 'KO', right: 'The Coca-Cola Company' },
		{ left: 'PEP', right: 'PepsiCo, Inc.' },
		{ left: 'CSCO', right: 'Cisco Systems, Inc.' },
		{ left: 'NFLX', right: 'Netflix, Inc.' },
		{ left: 'INTC', right: 'Intel Corporation' },
		{ left: 'T', right: 'AT&T Inc.' },
		{ left: 'XOM', right: 'Exxon Mobil Corporation' },
		{ left: 'WMT', right: 'Walmart Inc.' },
		{ left: 'NKE', right: 'Nike, Inc.' },
		{ left: 'CVX', right: 'Chevron Corporation' },
		{ left: 'MRK', right: 'Merck & Co., Inc.' },
		{ left: 'MCD', right: 'McDonald\'s Corporation' },
		{ left: 'VZ', right: 'Verizon Communications' },
		{ left: 'ADBE', right: 'Adobe Inc.' },
		{ left: 'PYPL', right: 'PayPal Holdings, Inc.' },
		{ left: 'CRM', right: 'Salesforce, Inc.' },
		{ left: 'ABBV', right: 'AbbVie Inc.' },
		{ left: 'QCOM', right: 'Qualcomm Incorporated' },
		{ left: 'COST', right: 'Costco Wholesale Corporation' },
		{ left: 'AMD', right: 'Advanced Micro Devices, Inc.' },
		{ left: 'ORCL', right: 'Oracle Corporation' },
		{ left: 'GS', right: 'Goldman Sachs Group' },
		{ left: 'IBM', right: 'International Business Machines' },
		{ left: 'CAT', right: 'Caterpillar Inc.' },
		{ left: 'LMT', right: 'Lockheed Martin Corporation' },
		{ left: 'GE', right: 'General Electric Company' },
		{ left: 'BA', right: 'The Boeing Company' },
		{ left: 'HON', right: 'Honeywell International' },
		{ left: 'TXN', right: 'Texas Instruments' },
	],

	[SymbolType.Forex]: [
		{ left: 'EUR', right: 'USD' }, // EURUSD
		{ left: 'USD', right: 'JPY' }, // USDJPY
		{ left: 'GBP', right: 'USD' }, // GBPUSD
		{ left: 'AUD', right: 'USD' }, // AUDUSD
		{ left: 'USD', right: 'CAD' }, // USDCAD
		{ left: 'USD', right: 'CHF' }, // USDCHF
		{ left: 'NZD', right: 'USD' }, // NZDUSD
		{ left: 'EUR', right: 'GBP' }, // EURGBP
		{ left: 'EUR', right: 'JPY' }, // EURJPY
		{ left: 'GBP', right: 'JPY' }, // GBPJPY
		{ left: 'AUD', right: 'JPY' }, // AUDJPY
		{ left: 'CAD', right: 'JPY' }, // CADJPY
		{ left: 'CHF', right: 'JPY' }, // CHFJPY
		{ left: 'EUR', right: 'AUD' }, // EURAUD
		{ left: 'EUR', right: 'NZD' }, // EURNZD
		{ left: 'GBP', right: 'AUD' }, // GBPAUD
		{ left: 'GBP', right: 'CAD' }, // GBPCAD
		{ left: 'GBP', right: 'NZD' }, // GBPNZD
		{ left: 'AUD', right: 'CAD' }, // AUDCAD
		{ left: 'AUD', right: 'CHF' }, // AUDCHF
		{ left: 'AUD', right: 'NZD' }, // AUDNZD
		{ left: 'CAD', right: 'CHF' }, // CADCHF
		{ left: 'EUR', right: 'NOK' }, // EURNOK
		{ left: 'EUR', right: 'SEK' }, // EURSEK
		{ left: 'EUR', right: 'CHF' }, // EURCHF
		{ left: 'USD', right: 'NOK' }, // USDNOK
		{ left: 'USD', right: 'SEK' }, // USDSEK
		{ left: 'USD', right: 'MXN' }, // USDMXN
		{ left: 'USD', right: 'BRL' }, // USDBRL
		{ left: 'USD', right: 'CNH' }, // USDCNH
		{ left: 'USD', right: 'HKD' }, // USDHKD
		{ left: 'USD', right: 'ZAR' }, // USDZAR
		{ left: 'USD', right: 'TRY' }, // USDTRY
		{ left: 'USD', right: 'PLN' }, // USDPLN
		{ left: 'USD', right: 'HUF' }, // USDHUF
		{ left: 'EUR', right: 'PLN' }, // EURPLN
		{ left: 'EUR', right: 'HUF' }, // EURHUF
		{ left: 'EUR', right: 'TRY' }, // EURTRY
		{ left: 'EUR', right: 'ZAR' }, // EURZAR
		{ left: 'GBP', right: 'CHF' }, // GBPCHF
		{ left: 'NZD', right: 'JPY' }, // NZDJPY
		{ left: 'NOK', right: 'JPY' }, // NOKJPY
		{ left: 'SEK', right: 'JPY' }, // SEKJPY
		{ left: 'SGD', right: 'JPY' }, // SGDJPY
		{ left: 'USD', right: 'ILS' }, // USDILS
		{ left: 'USD', right: 'SGD' }, // USDSGD
		{ left: 'USD', right: 'KRW' }, // USDKRW
		{ left: 'USD', right: 'RUB' }, // USDRUB
		{ left: 'EUR', right: 'CZK' }, // EURCZK
		{ left: 'USD', right: 'THB' }, // USDTHB
	],

	[SymbolType.Commodity]: [
		{ left: 'XAUUSD', right: 'Gold (spot)' },
		{ left: 'XAGUSD', right: 'Silver (spot)' },
		{ left: 'XPTUSD', right: 'Platinum (spot)' },
		{ left: 'XPDUSD', right: 'Palladium (spot)' },
		{ left: 'WTI', right: 'WTI Crude Oil' },
		{ left: 'BRENT', right: 'Brent Crude Oil' },
		{ left: 'NG', right: 'Natural Gas' },
		{ left: 'HG', right: 'Copper (COMEX)' },
		{ left: 'ZC', right: 'Corn' },
		{ left: 'ZW', right: 'Wheat' },
		{ left: 'ZS', right: 'Soybeans' },
		{ left: 'KC', right: 'Coffee' },
		{ left: 'CT', right: 'Cotton' },
		{ left: 'SB', right: 'Sugar' },
		{ left: 'OJ', right: 'Orange Juice' },
		{ left: 'CC', right: 'Cocoa' },
		{ left: 'LBS', right: 'Live Cattle' },
		{ left: 'LE', right: 'Feeder Cattle' },
		{ left: 'GF', right: 'Frozen Pork Bellies (historic)' },
		{ left: 'HE', right: 'Lean Hogs' },
		{ left: 'SI', right: 'Silver (alt ticker)' },
		{ left: 'GC', right: 'Gold (COMEX)' },
		{ left: 'PL', right: 'Platinum (COMEX)' },
		{ left: 'PA', right: 'Palladium (COMEX)' },
		{ left: 'URANIUM', right: 'Uranium' },
		{ left: 'RBOB', right: 'RBOB Gasoline' },
		{ left: 'HO', right: 'Heating Oil' },
		{ left: 'LMEAL', right: 'LME Aluminium' },
		{ left: 'LMCAD', right: 'LME Cadmium' },
		{ left: 'LMZINC', right: 'LME Zinc' },
		{ left: 'LMNICKEL', right: 'LME Nickel' },
		{ left: 'LMTIN', right: 'LME Tin' },
		{ left: 'LMALUM', right: 'LME Aluminium (alt)' },
		{ left: 'COCOA', right: 'Cocoa (ICE)' },
		{ left: 'COFFEE', right: 'Coffee (ICE)' },
		{ left: 'CORN', right: 'Corn (CBOT)' },
		{ left: 'SOYBEAN', right: 'Soybean (CBOT)' },
		{ left: 'WHEAT', right: 'Wheat (CBOT)' },
		{ left: 'RICE', right: 'Rice' },
		{ left: 'COTTON', right: 'Cotton (ICE)' },
		{ left: 'SUGAR', right: 'Sugar (ICE)' },
		{ left: 'MILK', right: 'Milk' },
		{ left: 'CATTLE', right: 'Live Cattle' },
		{ left: 'HOGS', right: 'Hogs' },
		{ left: 'WOOL', right: 'Wool' },
		{ left: 'LUMBER', right: 'Lumber' },
		{ left: 'OATS', right: 'Oats' },
		{ left: 'COBALT', right: 'Cobalt' },
	],

	[SymbolType.Index]: [
		{ left: 'SPX', right: 'S&P 500' },
		{ left: 'NDX', right: 'Nasdaq 100' },
		{ left: 'DJI', right: 'Dow Jones Industrial Average' },
		{ left: 'RUT', right: 'Russell 2000' },
		{ left: 'VIX', right: 'CBOE Volatility Index' },
		{ left: 'FTSE', right: 'FTSE 100' },
		{ left: 'DAX', right: 'DAX (Germany)' },
		{ left: 'CAC40', right: 'CAC 40 (France)' },
		{ left: 'IBEX', right: 'IBEX 35 (Spain)' },
		{ left: 'AEX', right: 'AEX (Netherlands)' },
		{ left: 'OMXS30', right: 'OMX Stockholm 30' },
		{ left: 'SMI', right: 'SMI (Switzerland)' },
		{ left: 'NIKKEI225', right: 'Nikkei 225' },
		{ left: 'TOPIX', right: 'TOPIX (Japan)' },
		{ left: 'HSI', right: 'Hang Seng Index' },
		{ left: 'CSI300', right: 'CSI 300 (China)' },
		{ left: 'SSE50', right: 'SSE 50 (China)' },
		{ left: 'KOSPI', right: 'KOSPI (Korea)' },
		{ left: 'NIFTY50', right: 'NIFTY 50 (India)' },
		{ left: 'BSE30', right: 'BSE Sensex (India)' },
		{ left: 'ASX200', right: 'ASX 200 (Australia)' },
		{ left: 'NZ50', right: 'NZX 50 (New Zealand)' },
		{ left: 'TSX', right: 'S&P/TSX Composite (Canada)' },
		{ left: 'BOVESPA', right: 'Bovespa (Brazil)' },
		{ left: 'MEXBOL', right: 'IPC (Mexico)' },
		{ left: 'MOEX', right: 'MOEX Russia' },
		{ left: 'RTSI', right: 'RTS Index (Russia)' },
		{ left: 'TASE', right: 'TA-35 (Israel)' },
		{ left: 'JSE', right: 'JSE All Share (South Africa)' },
		{ left: 'EGX30', right: 'EGX 30 (Egypt)' },
		{ left: 'ADX', right: 'ADX General (UAE)' },
		{ left: 'TAIEX', right: 'TAIEX (Taiwan)' },
		{ left: 'PSEi', right: 'PSEi (Philippines)' },
		{ left: 'SET50', right: 'SET50 (Thailand)' },
		{ left: 'VNINDEX', right: 'VN-Index (Vietnam)' },
		{ left: 'KLCI', right: 'FTSE KLCI (Malaysia)' },
		{ left: 'IDX', right: 'IDX Composite (Indonesia)' },
		{ left: 'STI', right: 'STI (Singapore)' },
		{ left: 'MSCIWORLD', right: 'MSCI World' },
		{ left: 'MSCIEM', right: 'MSCI Emerging Markets' },
		{ left: 'EUROSTOXX50', right: 'Euro Stoxx 50' },
		{ left: 'MSCIACWI', right: 'MSCI ACWI' },
		{ left: 'SPLATAM', right: 'S&P Latin America' },
		{ left: 'MSCIAFRICA', right: 'MSCI Africa' },
		{ left: 'MSCI_GCC', right: 'MSCI GCC' },
		{ left: 'MSCIJAPAN', right: 'MSCI Japan' },
		{ left: 'MSCIKOREA', right: 'MSCI Korea' },
	],

	[SymbolType.PlaneText]: [
		{ left: 'Technology', right: '' },
		{ left: 'Healthcare', right: '' },
		{ left: 'Financials', right: '' },
		{ left: 'Consumer Goods', right: '' },
		{ left: 'Energy', right: '' },
		{ left: 'Industrials', right: '' },
		{ left: 'Materials', right: '' },
		{ left: 'Utilities', right: '' },
		{ left: 'Real Estate', right: '' },
		{ left: 'Telecommunications', right: '' },
		{ left: 'Services', right: '' },
		{ left: 'Semiconductors', right: '' },
		{ left: 'Automotive Industry', right: '' },
		{ left: 'Retail', right: '' },
		{ left: 'Biotechnology', right: '' },
		{ left: 'Pharmaceuticals', right: '' },
		{ left: 'Medical Devices', right: '' },
		{ left: 'Insurance', right: '' },
		{ left: 'Banking', right: '' },
		{ left: 'Investment Services', right: '' },
		{ left: 'Food & Beverages', right: '' },
		{ left: 'Restaurants', right: '' },
		{ left: 'Travel & Leisure', right: '' },
		{ left: 'Aerospace & Defense', right: '' },
		{ left: 'Construction', right: '' },
		{ left: 'Chemicals', right: '' },
		{ left: 'Metals & Mining', right: '' },
		{ left: 'Paper & Forest Products', right: '' },
		{ left: 'Shipping & Logistics', right: '' },
		{ left: 'Agriculture', right: '' },
		{ left: 'Oil & Gas', right: '' },
		{ left: 'Renewable Energy', right: '' },
		{ left: 'Media & Entertainment', right: '' },
		{ left: 'Gaming & Esports', right: '' },
		{ left: 'Internet Services', right: '' },
		{ left: 'Cloud Computing', right: '' },
		{ left: 'Cybersecurity', right: '' },
		{ left: 'Artificial Intelligence', right: '' },
		{ left: 'Blockchain', right: '' },
		{ left: 'E-commerce', right: '' },
		{ left: 'Fashion & Apparel', right: '' },
		{ left: 'Luxury Goods', right: '' },
		{ left: 'Education', right: '' },
		{ left: 'Professional Services', right: '' },
		{ left: 'Consulting', right: '' },
		{ left: 'Sports & Recreation', right: '' },
		{ left: 'Transportation', right: '' },
		{ left: 'Infrastructure', right: '' },
		{ left: 'Environmental Services', right: '' },
		{ left: 'Waste Management', right: '' },
	],
};

const tickerCount = 50;

export function generateRows<T extends RowCells = RowCells>(
	type: SymbolType,
	cols: ColumnWithoutSymbol[],
	countRows = tickerCount,
): TableRow<T>[] {
	return allTickers[type]
		.slice(0, countRows)
		.map(tickerData => {
			const tickerCell = createSymbolCell(type, tickerData);

			return {
				tickerId: createTickerId(tickerCell),
				[ColumnType.Symbol]: tickerCell,
				...Object
					.fromEntries(
						cols
							.map(col => [col, allCellByColumn[col]]),
					),
			} as TableRow<T>;
		});
}

type AllRows = {
	tickerId: string;
} & ColumnToCell;

export function generateAllRows() {
	return Object
		.values(SymbolType)
		.flatMap(type =>
			generateRows(
				type,
				Object
					.keys(allCellByColumn) as ColumnWithoutSymbol[],
			),
		) as AllRows[];
}

export function randomizeCellData(cell: Cell): Cell {
	switch (cell.cellType) {
		case CellType.Number:
			return randomizeNumberCell(cell as INumberCell);
		case CellType.Percent:
			return randomizePercentCell(cell as IPercentCell);
		case CellType.Range:
			return randomizeRangeCell(cell as IRangeCell);
		default:
			return cell;
	}
}

function randomizeNumberCell(cell: INumberCell): INumberCell {
	return {
		...cell,
		value: (86000 + Math.random() * 2000).toFixed(2),
	};
}

function randomizePercentCell(cell: IPercentCell): IPercentCell {
	return {
		...cell,
		value: (Math.random() * 100).toFixed(2),
	};
}

function randomizeRangeCell(cell: IRangeCell): IRangeCell {
	return {
		...cell,
		startValue: (86000 + Math.random() * 2000).toFixed(2),
		endValue: (86000 + Math.random() * 2000).toFixed(2),
	};
}

const symbolTypeToCell: Record<SymbolType, (td: ITickerData) => ISymbolCell> = {
	[SymbolType.Crypto]: createCryptoSymbolCell,
	[SymbolType.Stock]: createStockSymbolCell,
	[SymbolType.Index]: createIndexSymbolCell,
	[SymbolType.Commodity]: createCommoditySymbolCell,
	[SymbolType.Forex]: createForexSymbolCell,
	[SymbolType.PlaneText]: createPlainTextCell,
};

function createSymbolCell(type: SymbolType, tickerData: ITickerData): ISymbolCell {
	return symbolTypeToCell[type](tickerData);
}

function createCryptoSymbolCell(tickerData: ITickerData): ICryptoSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Crypto,
		srcImg: 'wrong.png',
		ticker: tickerData.left,
		blockchain: tickerData.right,
	};
}

function createStockSymbolCell(tickerData: ITickerData): IStockSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Stock,
		srcImg: 'wrong.png',
		ticker: tickerData.left,
		companyName: tickerData.right,
	};
}

function createIndexSymbolCell(tickerData: ITickerData): IIndexSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Index,
		srcImg: 'wrong.png',
		ticker: tickerData.left,
		indexName: tickerData.right,
	};
}

function createCommoditySymbolCell(tickerData: ITickerData): ICommoditySymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Commodity,
		srcImg: 'wrong.png',
		ticker: tickerData.left,
		commodityName: tickerData.right,
	};
}

function createForexSymbolCell(tickerData: ITickerData): IForexSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.Forex,
		leftTicker: tickerData.left,
		rightTicker: tickerData.right,
		leftSrcImg: 'wrong.png',
		rightSrcImg: 'wrong.png',
	};
}

function createPlainTextCell(tickerData: ITickerData): IPlaneTextSymbolCell {
	return {
		cellType: CellType.Symbol,
		columnType: ColumnType.Symbol,
		symbolType: SymbolType.PlaneText,
		text: tickerData.left,
	};
}

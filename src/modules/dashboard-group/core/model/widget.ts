export enum WidgetType {
	FearGreed = 'fear-greed',
	BitcoinDominance = 'bitcoin-dominance',
	Market = 'market',
	MarketCap = 'market-cap',
	News = 'news',
	Price = 'price',
	Watchlist = 'watchlist',
	Performance = 'performance',
	AltcoinSeason = 'altcoin-season',
	TopIndices = 'top-indices',
	Calendar = 'calendar',
	Heatmap = 'heatmap',
	ChartPrice = 'chart-price',
	Exchange = 'exchange',
	EthGas = 'eth-gas',
	ConsumerPriceIndex = 'consumer-price-index',
	NonfarmPayrolls = 'nonfarm-payrolls',
	NominalGDP = 'nominal-gdp',
	RealGDP = 'real-gdp',
	UnemploymentRate ='unemployment-rate',
}

export function isWidgetTypeKey(value: string): value is WidgetType {
	return Object.values<string>(WidgetType).includes(value);
}

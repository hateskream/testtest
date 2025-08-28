export enum RouteNames {
	Home = 'home',
	Ticker = 'ticker',
	TickerCrypto = 'ticker-crypto',
	TickerStock = 'ticker-stock',
	TickerForex = 'ticker-forex',
	TickerCommodities = 'ticker-commodities',
	TickerIndices = 'ticker-indices',
	TickerETF = 'ticker-etf',
	Test = 'test',
	Automobile = 'Automobile',
	Heatmap = 'Heatmap',
}

export enum RoutePaths {
	Home = '/',
	Ticker = '/ticker',
	TickerCryptoWithId = 'crypto/:id',
	TickerStockWithId = 'stock/:id',
	TickerForexWithId = 'forex/:id',
	TickerCommoditiesWithId = 'commodities/:id',
	TickerIndicesWithId = 'indices/:id',
	TickerETFWithId = 'etf/:id',
	TickerCrypto = 'crypto',
	TickerStock = 'stock',
	TickerForex = 'forex',
	TickerCommodities = 'commodities',
	TickerIndices = 'indices',
	TickerETF = 'etf',
	Test = '/test',
	Automobile = '/automobile',
	Heatmap = '/heatmap',
}

export enum RouteTickerType {
	CRYPTO = 'crypto',
	STOCK = 'stock',
	FOREX = 'forex',
	COMMODITIES = 'commodities',
	INDICES = 'indices',
	ETF = 'etf',
}

export interface ITickerRouteParams {
	id: number;
	type: TickerType;
}

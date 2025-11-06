export enum RouteNames {
	Home = 'home',
	Tv = 'tv',
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
	Calendar = 'Calendar',
	News = 'News',
}

export enum RouteLabels {
	Home = 'Dashboard',
	Tv = 'TV',
	Heatmap = 'Heatmap',
	TickerCrypto = 'Ticker Crypto',
	TickerStock = 'Ticker Stock',
	TickerForex = 'Ticker Forex',
	TickerCommodities = 'Ticker Commodities',
	TickerIndices = 'Ticker Indices',
	TickerETF = 'Ticker Etf',
	Test = 'Test',
	Automobile = 'Automobile',
	Calendar = 'Calendar',
	News = 'News',
}

export enum RoutePaths {
	Home = '/',
	Tv = '/tv',
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
	Calendar = '/calendar',
	News = '/news',
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

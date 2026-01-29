import 'vue-router';

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
	TickerOld = 'ticker-old',
	TickerCryptoOld = 'ticker-crypto-old',
	TickerStockOld = 'ticker-stock-old',
	TickerForexOld = 'ticker-forex-old',
	TickerCommoditiesOld = 'ticker-commodities-old',
	TickerIndicesOld = 'ticker-indices-old',
	TickerETFOld = 'ticker-etf-old',
	Test = 'test',
	Automobile = 'Automobile',
	Heatmap = 'Heatmap',
	Calendar = 'Calendar',
	Screener = 'Screener',
	ScreenerStock = 'screener-stock',
	ScreenerCrypto = 'screener-crypto',
	ScreenerEtf = 'screener-etf',
	ScreenerBond = 'screener-bond',
	ScreenerCex = 'screener-cex',
	ScreenerDex = 'screener-dex',
	News = 'News',
	NewsDetails = 'NewsDetails',
	Error = 'Error',
	Offline = 'Offline',
	TickerPageFooter = 'ticker-page-footer',
	TickerPageHeader = 'ticker-page-header',
	LinksTestPage = 'LinksTestPage',
	KeyIndicatorsTest = 'KeyIndicatorsTest',
	TickerWidget = 'ticker-widget',
	TickerWidgetPreview = 'ticker-widget-preview',
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
	TickerCryptoOld = 'Ticker Crypto Old',
	TickerStockOld = 'Ticker Stock Old',
	TickerForexOld = 'Ticker Forex Old',
	TickerCommoditiesOld = 'Ticker Commodities Old',
	TickerIndicesOld = 'Ticker Indices Old',
	TickerETFOld = 'Ticker Etf Old',
	Test = 'Test',
	Automobile = 'Automobile',
	Calendar = 'Calendar',
	News = 'News',
	Screener = 'Screener',
	ScreenerStock = 'Stock Screener',
	ScreenerCrypto = 'Crypto Screener',
	ScreenerEtf = 'ETF Screener',
	ScreenerBond = 'Bond Screener',
	ScreenerCex = 'CEX Screener',
	ScreenerDex = 'DEX Screener',
	TickerPageFooter = 'Ticker Page Footer',
	TickerPageHeader = 'Ticker Page Header',
	LinksTestPage = 'Links Test Page',
	KeyIndicatorsTest = 'Key Indicators Test',
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
	TickerOld = '/ticker-old',
	Test = '/test',
	Automobile = '/automobile',
	Heatmap = '/heatmap',
	Calendar = '/calendar',
	Screener = '/screener',
	ScreenerStock = '/screener/stock',
	ScreenerCrypto = '/screener/crypto',
	ScreenerEtf = '/screener/etf',
	ScreenerBond = '/screener/bond',
	ScreenerCex = '/screener/cex',
	ScreenerDex = '/screener/dex',
	News = '/news',
	NewsDetails = ':slug/:id',
	Error = '/error',
	Offline = '/offline',
	TickerPageFooter = '/ticker-page-footer-test',
	TickerPageHeader = '/ticker-page-header-test',
	LinksTestPage = '/links-test-page',
	KeyIndicatorsTest = '/key-indicators-test',
	TickerWidget = '/ticker-widget',
	TickerWidgetPreview = '/ticker-widget/:widgetName',
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
	id: string;
	type: TickerType;
}

export enum RouteScreenerType {
	STOCK = 'stock',
	CRYPTO = 'crypto',
	ETF = 'etf',
	BOND = 'bond',
	CEX = 'cex',
	DEX = 'dex',
}

export interface IScreenerRouteParams {
	id?: string;
	type: RouteScreenerType;
}

declare module 'vue-router' {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface RouteMeta {
		/**
		 * Keep titles under 60 characters to avoid truncation in search results
		 */
		title?: string;
		titleTemplate?: string;
		description?: string;
		/**
		 * Image url for og:image and twitter:image
		 */
		image?: string;
	}
}

// Cell types enum to avoid magic strings
export enum CellType {
	SYMBOL = 'symbol',
	NUMBER = 'number',
	PERCENT = 'percent',
	CHART = 'chart',
	RANGE = 'range',
	TEXT = 'text',
}

// Column types enum
export enum ColumnType {
	// Symbol types
	SYMBOL = 'symbol',

	// Number types
	PRICE = 'price',
	VOLUME24H = 'volume24h',
	MARKET_CAP24H = 'marketCap24h',
	VOLUME = 'volume',
	MARKET_CAP = 'marketCap',
	RSI = 'rsi',
	BETA = 'beta',
	OPEN_PRICE = 'openPrice',
	CLOSE_PRICE = 'closePrice',
	CHANGE_PRICE24H = 'changePrice24h',
	PRICE_MIN24H = 'priceMin24h',
	PRICE_MAX24H = 'priceMax24h',
	PRICE_MIN1Y = 'priceMin1y',
	PRICE_MAX1Y = 'priceMax1y',
	PRICE_AVG50D = 'priceAvg50d',
	PRICE_AVG200D = 'priceAvg200d',
	VOLUME_REL10D = 'volumeRel10d',
	VOLUME_AVG10D = 'volumeAvg10d',

	// Percent types
	CHG1H = 'chg1h',
	CHG24H = 'chg24h',
	CHG7D = 'chg7d',
	CHG30D = 'chg30d',

	// Chart types
	CHART24H = 'chart24h',
	CHART7D = 'chart7d',
	CHART30D = 'chart30d',
	RSI_CHART = 'rsiChart',

	// Range types
	RANGE1Y = 'range1y',

	// Text types
	LAST_DIVIDEND = 'lastDividend',
	EMPLOYEES = 'employees',
	IPO_DATE = 'ipoDate',
	SECTOR = 'sector',
	INDUSTRY = 'industry',
	SOURCE = 'source',
	LISTING_DATE = 'listingDate',
	UPDATE_DATE = 'updateDate',
}

// Trend types enum
export enum TrendType {
	UP = 'up',
	DOWN = 'down',
	NEUTRAL = 'neutral',
}

// CSS class names enum
export enum TrendCssClass {
	POSITIVE = 'positive',
	NEGATIVE = 'negative',
	NEUTRAL = 'neutral',
}

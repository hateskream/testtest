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

	PRICE_CURRENT= 'priceCurrent',
	PRICE_MIN24H= 'priceMin24h',
	PRICE_MAX24H= 'priceMax24h',
	PRICE_MIN1Y= 'priceMin1y',
	PRICE_MAX1Y= 'priceMax1y',
	PRICE_AVG50D= 'priceAvg50d',
	PRICE_AVG200D= 'priceAvg200d',
	CHANGE_PRICE_24H= 'changePrice24h',
	VOLUME_24H= 'volume24h',
	VOLUME_REL10D= 'volumeRel10d',
	VOLUME_AVG10D= 'volumeAvg10d',
	MARKET_CAP24H= 'marketCap24h',
	RSI_NUMBER= 'rsiNumber',
	BETA5Y= 'beta5y',
	OPEN_PRICE= 'openPrice',
	CLOSE_PRICE= 'closePrice',

	CHANGE_PRICE_1H_PERCENT= 'changePrice1hPercent',
	CHANGE_PRICE_24H_PERCENT= 'changePrice24hPercent',
	CHANGE_PRICE_7D_PERCENT= 'changePrice7dPercent',
	CHANGE_PRICE_30D_PERCENT= 'changePrice30dPercent',

	PRICE_1Y_RANGE= 'price1yRange',

	PRICE_24H_CHART= 'price24hChart',
	PRICE_7D_CHART= 'price7dChart',
	PRICE_30D_CHART= 'price30dChart',
	RSI_CHART= 'rsiChart',

	LAST_DIVIDEND= 'lastDividend',
	COMPANY_EMPLOYEES= 'companyEmployees',
	COMPANY_IPO_DATE= 'companyIpoDate',
	COMPANY_SECTOR= 'companySector',
	COMPANY_INDUSTRY= 'companyIndustry',
	SOURCE= 'source',
	LISTING_DATE= 'listingDate',
	UPDATE_DATE= 'updateDate',
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

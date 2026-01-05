export enum EventType {
	Economic = 'ECONOMIC',
	Earnings = 'EARNINGS',
	Ipo = 'IPO',
	Dividend = 'DIVIDEND',
	Split = 'SPLIT',
	CryptoEvent = 'CRYPTO_EVENT',
	StockNews = 'STOCK_NEWS',
	ForexNews = 'FOREX_NEWS',
	GeneralNews = 'GENERAL_NEWS',
	PressRelease = 'PRESS_RELEASE',
	CryptoNews = 'CRYPTO_NEWS',
}

export const EventTypeToLabels: Record<EventType, string> = {
	[EventType.Economic]: 'Economic',
	[EventType.Earnings]: 'Earnings',
	[EventType.Ipo]: 'Ipos',
	[EventType.Dividend]: 'Dividends',
	[EventType.Split]: 'Splits',
	[EventType.CryptoEvent]: 'Crypto',
	[EventType.StockNews]: 'Stock',
	[EventType.ForexNews]: 'Forex',
	[EventType.GeneralNews]: 'General Market',
	[EventType.PressRelease]: 'Press Releases',
	[EventType.CryptoNews]: 'Crypto',
};


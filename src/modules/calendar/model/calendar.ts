import { IconIds } from '@/shared/ui/icon';

export const CalendarCategory = {
	Economic: 'ECONOMIC',
	Earnings: 'EARNINGS',
	Ipo: 'IPO',
	Dividend: 'DIVIDEND',
	Split: 'SPLIT',
	CryptoEvent: 'CRYPTO_EVENT',
	StockNews: 'STOCK_NEWS',
	ForexNews: 'FOREX_NEWS',
	GeneralNews: 'GENERAL_NEWS',
	PressRelease: 'PRESS_RELEASE',
	CryptoNews: 'CRYPTO_NEWS',
} as const;

export type CalendarCategoryType = typeof CalendarCategory[keyof typeof CalendarCategory];

export const CalendarCategoryToLabels = {
	[CalendarCategory.Economic]: 'Economic',
	[CalendarCategory.Earnings]: 'Earnings',
	[CalendarCategory.Ipo]: 'Ipos',
	[CalendarCategory.Dividend]: 'Dividends',
	[CalendarCategory.Split]: 'Splits',
	[CalendarCategory.CryptoEvent]: 'Crypto',
	[CalendarCategory.StockNews]: 'Stock',
	[CalendarCategory.ForexNews]: 'Forex',
	[CalendarCategory.GeneralNews]: 'General Market',
	[CalendarCategory.PressRelease]: 'Press Releases',
	[CalendarCategory.CryptoNews]: 'Crypto',
} as const satisfies Record<CalendarCategoryType, string>;

export const CalendarImpact = {
	Low: 'LOW',
	Medium: 'MEDIUM',
	High: 'HIGH',
} as const;

export type CalendarImpactType = typeof CalendarImpact[keyof typeof CalendarImpact];

export const CalendarImpactToLabels = {
	[CalendarImpact.Low]: 'Low',
	[CalendarImpact.Medium]: 'Medium',
	[CalendarImpact.High]: 'High',
} as const satisfies Record<CalendarImpactType, string>;

export const CalendarCountryIds = {
	USA: 'usa',
	India: 'india',
	Germany: 'germany',
	Japan: 'japan',
	Canada: 'canada',
	HongKong: 'hongkong',
	UnitedKingdom: 'united-kingdom',
} as const;

export type CalendarCountryIdsType = typeof CalendarCountryIds[keyof typeof CalendarCountryIds];

export interface ICalendarCountryData {
	id: CalendarCountryIdsType;
	label: string;
	icon: IconIds;
}

export const calendarCountryData = [
	{ id: CalendarCountryIds.USA, label: 'USA', icon: IconIds.USA },
	{ id: CalendarCountryIds.India, label: 'India', icon: IconIds.India },
	{ id: CalendarCountryIds.Germany, label: 'Germany', icon: IconIds.Germany },
	{ id: CalendarCountryIds.Japan, label: 'Japan', icon: IconIds.Japan },
	{ id: CalendarCountryIds.Canada, label: 'Canada', icon: IconIds.Canada },
	{ id: CalendarCountryIds.HongKong, label: 'Hong Kong, China', icon: IconIds.HongKong },
	{ id: CalendarCountryIds.UnitedKingdom, label: 'United Kingdom', icon: IconIds.UnitedKingdom },
] as const satisfies ICalendarCountryData[];

export const COUNTRY_TO_ISO = {
	[CalendarCountryIds.USA]: 'US',
	[CalendarCountryIds.India]: 'IN',
	[CalendarCountryIds.Germany]: 'DE',
	[CalendarCountryIds.Japan]: 'JP',
	[CalendarCountryIds.Canada]: 'CA',
	[CalendarCountryIds.HongKong]: 'HK',
	[CalendarCountryIds.UnitedKingdom]: 'GB',
} as const satisfies Record<CalendarCountryIdsType, string>;

export interface ICalendarEventBadge {
	label: string;
	color: 'negative' | 'neutral' | 'positive';
}

export interface ICalendarEventDetails {
	label: string;
	link: string;
}

export interface ICalendarEventMetric {
	label: string;
	value: string;
}

export interface ICalendarEvent {
	id: string;
	meta: {
		title: string;
		description: string;
		datetime: string;
		image: string;
		category: CalendarCategoryType;
		country: CalendarCountryIdsType;
		impact: CalendarImpactType;
		badge?: ICalendarEventBadge;
	};
	canonical_ticker_id: string;
	metrics: ICalendarEventMetric[];
	details?: ICalendarEventDetails;
}

export interface IEventBoardItem {
	date: string;
	events: ICalendarEvent[];
}

export interface IEventBoardResponse {
	days: IEventBoardItem[];
}

export interface IEventBoardRequest {
	from: number;
	to?: number;
	countries?: CalendarCountryIdsType[];
	categories?: CalendarCategoryType[];
	minImpact?: CalendarImpactType[];
	tickerIDs?: string[];
}

/* DAILY INFO SECTION */
export interface IDailyInfoMetrics {
	crypto_events?: number;
	dividends: number;
	earnings: number;
	economic: number;
	ipo?: number;
	news?: number;
	splits?: number;
}

export interface IDailyInfoItem {
	date: string;
	metrics: IDailyInfoMetrics;
}

export type IDailyInfoResponse = IDailyInfoItem[];

export interface IDailyInfoRequest {
	from: string; // YYYY-DD-MM
	to: string; // YYYY-DD-MM
}

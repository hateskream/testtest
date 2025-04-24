import type { IFilterList } from '../../base/model/filter-modal';

export const NewsSegment = {
	Crypto: 'crypto',
	Stock: 'stock',
	Forex: 'forex',
} as const;

export type NewsSegment = (typeof NewsSegment)[keyof typeof NewsSegment];

export const NewsSource = {
	InvestingCom: 'investing.com',
	Benzinga: 'benzinga',
} as const;

export type NewsSource = (typeof NewsSource)[keyof typeof NewsSource];

export const NewsSentiment = {
	Optimistic: 'optimistic',
	Neutral: 'neutral',
	Pessimistic: 'pessimistic',
} as const;

export type NewsSentiment = (typeof NewsSentiment)[keyof typeof NewsSentiment];

export const NewsScore = {
	Low: 'low',
	Medium: 'medium',
	High: 'high',
} as const;

export type NewsScore = (typeof NewsScore)[keyof typeof NewsScore];

export interface INewsStock {
	ticker: string;
	name: string;
	srcImage: string;
}

export interface INews {
	id: string;
	description: string;
	timestamp: number;
	author: string;
	title: string;
	stocks: INewsStock[];
	score: number;
	segment: NewsSegment;
	source: NewsSource;
	srcSourceImage: string;
	sentiment: NewsSentiment;
	location: {
		name: string;
		code: string;
	};
}

export interface IFilterNews {
	segment: IFilterList<NewsSegment>;
	source: IFilterList<NewsSource>;
	sentiment: IFilterList<NewsSentiment>;
	score: IFilterList<NewsScore>;
	// dateRange: IFilterDateRange;
}

export interface INewsLocationCountry {
	name: string;
	code: string;
	isActive: boolean;
}

export interface INewsLocation {
	region: string;
	isActive: boolean;
	isCanAllSwitch: boolean;
	countries: INewsLocationCountry[];
}

export interface INewsCryptoCurrency {
	id: string;
	ticker: string;
	name: string;
	srcImage: string;
}

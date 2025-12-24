import { type IActiveLocation, type ISegmentRequest, Score, Sentiment, type SortState, Source } from '@/modules/news';
import type { DateYYYYMMDD } from '@/modules/calendar';

export interface ITicker {
	ticker: string;
	name: string;
	srcImage: string[];
}

export interface INews {
	id: string;
	slug: string;
	description: string;
	timestamp: number;
	author: string;
	title: string;
	stocks: ITicker[];
	score: number;
	srcSourceImage: string;
}

export interface INewsSource {
	site: string;
	url: string;
}

export interface IGetNewsRequest {
	offset: number;
	limit: number;
	score: Set<Score>;
	segment: ISegmentRequest;
	sentiment: Set<Sentiment>;
	source: Set<Source>;
	activeSort: SortState;
	locations: IActiveLocation[];
	dateFrom: DateYYYYMMDD;
	dateTo: DateYYYYMMDD;
}

export interface IGetNewsDetailsRequest {
	id: string;
}

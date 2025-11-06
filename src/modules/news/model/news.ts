import { type IActiveLocation, type ISegmentRequest, Score, Sentiment, type SortState, Source } from '@/modules/news';

export interface ITicker {
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
	stocks: ITicker[];
	score: number;
	srcSourceImage: string;
}

export interface IGetNewsRequest {
	offset: number;
	limit: number;
	score: Set<Score>;
	segment: ISegmentRequest;
	sentiment: Set<Sentiment>;
	source: Set<Source>;
	selectedTickers: string[];
	activeSort: SortState;
	locations: IActiveLocation[];
}

export interface IGetNewsDetailsRequest {
	id: string;
}

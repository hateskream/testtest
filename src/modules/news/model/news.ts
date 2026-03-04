import {
	type IActiveLocation,
	type ISegmentRequest,
	type ScoreType,
	type SentimentType,
	type SortState,
	type SourceType,
} from '@/modules/news';
import type { INewsTicker } from '../api/get-news-data';

export interface INews {
	id: string;
	slug: string;
	author?: string;
	first_seen_at: string;
	primary_title: string;
	sentiment: {
		score: ScoreType;
		tone: SentimentType;
	};
	snippet: string;
	sources_count: number;
	src_source_image?: string;
	tickers?: INewsTicker[];
	updated_at: string;
}

export interface INewsSource {
	site: string;
	url: string;
}

export type DateYYYYMMDD = string;

export interface IGetNewsRequest {
	offset: number;
	limit: number;
	score: Set<ScoreType>;
	segment: ISegmentRequest;
	sentiment: Set<SentimentType>;
	source: Set<SourceType>;
	activeSort: SortState;
	locations: IActiveLocation[];
	dateFrom: DateYYYYMMDD;
	dateTo: DateYYYYMMDD;
}

export interface IGetNewsDetailsRequest {
	id: string;
}

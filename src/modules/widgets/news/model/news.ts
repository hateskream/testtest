import type { MarketType } from '@/modules/market';
import type { Sentiment, Source } from './filters';

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
	segment: MarketType;
	source: Source;
	srcSourceImage: string;
	sentiment: Sentiment;
	location: {
		name: string;
		code: string;
	};
}

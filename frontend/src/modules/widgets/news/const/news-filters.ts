import { FilterType } from '../../base/modal/model';
import { NewsScore, NewsSegment, NewsSentiment, NewsSource, type IFilterNews } from '../model';

export const NEWS_FILTERS: IFilterNews = {
	score: {
		name: 'Score',
		list: Object.entries(NewsScore).map(([key, value]) => ({
			value,
			label: key,
		})),
		value: [NewsScore.Low],
		type: FilterType.List,
		multiple: false,
	},
	segment: {
		name: 'Segment',
		list: Object.entries(NewsSegment).map(([key, value]) => ({
			value,
			label: key,
		})),
		value: [NewsSegment.Crypto],
		type: FilterType.List,
		multiple: false,
	},
	sentiment: {
		name: 'Sentiment',
		list: Object.entries(NewsSentiment).map(([key, value]) => ({
			value,
			label: key,
		})),
		value: Object.values(NewsSentiment),
		type: FilterType.List,
		multiple: true,
	},
	source: {
		name: 'Source',
		list: Object.entries(NewsSource).map(([key, value]) => ({
			value,
			label: key,
		})),
		value: Object.values(NewsSource),
		type: FilterType.List,
		multiple: true,
	},
	// dateRange: {
	// 	name: 'Date range',
	// 	value: 'all',
	// 	type: FilterType.DateRange,
	// },
};

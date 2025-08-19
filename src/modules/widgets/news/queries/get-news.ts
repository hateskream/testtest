import { useInfiniteQuery } from '@tanstack/vue-query';
import type { Ref } from 'vue';

import { getNews } from '../api';
import type { MarketType } from '@/modules/market';
import type { Score, Sentiment, Source, SortState, IActiveLocation } from '../model';

export interface IGetNewsRequest {
	limit: number;
	score: Set<Score>;
	segment: Set<MarketType>;
	sentiment: Set<Sentiment>;
	source: Set<Source>;
	selectedTickers: string[];
	activeSort: SortState;
	locations: IActiveLocation[];
}

export function useQueryNews(req: Ref<IGetNewsRequest>) {
	return useInfiniteQuery({
		queryKey: [
			'news',
			() => [
				Array.from(req.value.score),
				Array.from(req.value.segment),
				Array.from(req.value.sentiment),
				Array.from(req.value.source),
				req.value.selectedTickers,
				req.value.activeSort,
				req.value.locations,
			],
		],
		queryFn: ({ pageParam = 0 }) => getNews({ ...req.value, offset: pageParam }),
		initialPageParam: 0,
		getNextPageParam: (lastPage) => {
			if (!lastPage) {
				return undefined;
			}

			const { total, offset } = lastPage.pagination;
			const nextOffset = offset + req.value.limit;
			return nextOffset < total ? nextOffset : undefined;
		},
	});
}

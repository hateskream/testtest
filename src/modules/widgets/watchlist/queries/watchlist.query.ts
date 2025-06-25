import { useQuery } from '@tanstack/vue-query';
import { unref, type Ref, type ComputedRef } from 'vue';

import {
	getWatchlistSections,
	getWatchlistWidget,
	type IGetWatchlistRequest,
	type IGetWatchlistWidgetRequest,
} from '../api';

export function useQueryWatchlistData(
	args:	IGetWatchlistRequest |	Ref<IGetWatchlistRequest> |	ComputedRef<IGetWatchlistRequest>,
) {
	return useQuery({
		queryKey: [
			'watchlist',
			() => unref(args).sort,
			() => unref(args).watchlistIdx,
		],
		queryFn: () => getWatchlistSections(unref(args)),
	});
}

export function useQueryWatchlistWidget(
	args:	IGetWatchlistWidgetRequest |	Ref<IGetWatchlistWidgetRequest> |	ComputedRef<IGetWatchlistWidgetRequest>,
) {
	return useQuery({
		queryKey: [
			'watchlist',
			() => unref(args).market,
			// () => unref(args).watchlistIdx,
		],
		queryFn: () => getWatchlistWidget(unref(args)),
	});
}

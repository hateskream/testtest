import { useQuery } from '@tanstack/vue-query';
import { unref, type Ref, type ComputedRef } from 'vue';

import {
	getWatchlistSections,
	getWatchlistWidget,
	type IGetWatchlistRequest,
	type IGetWatchlistWidgetRequest,
} from '../api';

interface IUseQueryOptions {
	enabled?: Ref<boolean> | ComputedRef<boolean>;
}

// eslint-disable-next-line @stylistic/max-len
export function useQueryWatchlistWidget(args:	IGetWatchlistWidgetRequest | Ref<IGetWatchlistWidgetRequest> | ComputedRef<IGetWatchlistWidgetRequest>) {
	return useQuery({
		queryKey: [
			'watchlist-widget',
			() => unref(args).market,
		],
		queryFn: () => getWatchlistWidget(unref(args)),
	});
}


export function useQueryWatchlistData(
	args: IGetWatchlistRequest | Ref<IGetWatchlistRequest | null> | ComputedRef<IGetWatchlistRequest | null>,
	options?: IUseQueryOptions,
) {
	return useQuery({
		queryKey: [
			'watchlist-data',
			() => {
				const argsValue = unref(args);
				return argsValue ? argsValue.tabId : null;
			},
		],
		queryFn: () => {
			const argsValue = unref(args);
			if (!argsValue) {
				throw new Error('No arguments provided for watchlist data query');
			}
			return getWatchlistSections(argsValue);
		},
		enabled: options?.enabled,
	});
}

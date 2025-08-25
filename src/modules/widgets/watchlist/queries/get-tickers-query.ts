import { useQuery } from '@tanstack/vue-query';
import { unref, type Ref, type ComputedRef } from 'vue';

import {
	getWatchlistSections,
	type IGetWatchlistRequest,
} from '../api';

interface IUseQueryOptions {
	enabled?: Ref<boolean> | ComputedRef<boolean>;
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
		refetchOnMount: false,
	});
}

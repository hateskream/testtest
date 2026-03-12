import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/vue-query';
import { computed, type MaybeRefOrGetter, toValue } from 'vue';

import { fetchTickerSelector, initTickerSelector, type ITickerSelectorRequestBody } from '../api';

export function useInitTickerSelectorQuery() {
	return useQuery({
		queryKey: ['ticker-selector', 'init'],
		queryFn: initTickerSelector,
		staleTime: Infinity,
		gcTime: Infinity,
	});
}

export function useTickerSelectorInfiniteQuery(
	payload: MaybeRefOrGetter<ITickerSelectorRequestBody>,
	options: MaybeRefOrGetter<{ enabled?: boolean; keepPreviousData?: boolean }> = {},
) {
	const resolvedPayload = computed(
		() => toValue(payload),
	);

	const resolvedOptions = computed(
		() => toValue(options) || true,
	);

	const placeholderData = computed(() => {
		if (resolvedOptions.value.keepPreviousData) {
			return keepPreviousData;
		}

		return undefined;
	});

	const hasNotCacheable = computed(() => {
		// eslint-disable-next-line @typescript-eslint/naming-convention
		const { search_query, excluded_tickerIDs } = resolvedPayload.value;

		return (
			typeof search_query === 'string' && search_query.trim().length > 0 ||
			Array.isArray(excluded_tickerIDs) && excluded_tickerIDs.length > 0
		);
	});

	return useInfiniteQuery({
		enabled: () => resolvedOptions.value.enabled,
		queryKey: computed(() =>
			hasNotCacheable.value
				? ['ticker-selector', 'list', 'search', resolvedPayload.value]
				: ['ticker-selector', 'list', resolvedPayload.value],
		),
		queryFn: ({ pageParam }) => {
			return fetchTickerSelector({
				...resolvedPayload.value,
				page: pageParam,
			});
		},
		initialPageParam: 1,
		getNextPageParam: lastPage => {
			const { pagination } = lastPage;

			if (!pagination) {
				return undefined;
			}

			return pagination.page < pagination.total_pages ? pagination.page + 1 : undefined;
		},
		staleTime: computed(() => (hasNotCacheable.value ? 0 : Infinity)),
		gcTime: computed(() => (hasNotCacheable.value ? 0 : Infinity)),
		placeholderData: placeholderData,
	});
}

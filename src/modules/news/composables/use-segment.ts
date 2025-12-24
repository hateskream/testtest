import { computed, ref } from 'vue';

import { MarketType } from '@/modules/market';
import {
	getDefaultSegmentMarkets,
} from '@/modules/news/model';
import type { ITickerItem } from '@/modules/ticker-selector';

export function useSegment(
	defaultState?: string,
) {
	const selectedMarkets = ref<MarketType[]>(getDefaultSegmentMarkets(defaultState));
	const selectedTickers = ref<ITickerItem[]>([]);
	const excludedTickers = ref<ITickerItem[]>([]);

	const selectedSegmentsRequest = computed(() => ({
		selectedTickers: selectedTickers.value.map(v => v.canonical_ticker_id),
		excludedTickers: excludedTickers.value.map(v => v.canonical_ticker_id),
		selectedMarkets: selectedMarkets.value,
	}));

	return {
		selectedTickers,
		excludedTickers,
		selectedMarkets,
		selectedSegmentsRequest,
	};
}

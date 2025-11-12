import { computed, type MaybeRefOrGetter, ref, toValue } from 'vue';

import { MarketType } from '@/modules/market';
import type { ITickerData } from '@/shared/mock';
import { type ISegmentRequest, type SelectAllFrom, type SelectedSegmentTickersState } from '@/modules/news/model';
import { segmentsData } from '@/modules/news/model/segment-modal';
import * as utils from '@/modules/news/utils';
import { getDefaultSegmentTickers } from '@/modules/news/model/presets.ts';

export function useSegment(
	selectedSegments: MaybeRefOrGetter<Set<MarketType>>,
	defaultState?: string,
) {
	const selectedSegmentTickers = ref<SelectedSegmentTickersState>(
		getDefaultSegmentTickers(defaultState),
	);

	const segments = computed(() => {
		const selected = toValue(selectedSegments);

		if (!selected || selected.size === 0) {
			return segmentsData;
		}

		return segmentsData.filter((s) => selected.has(s.id));
	});

	const isAllSelected = computed((): boolean => {
		for (const type of Object.values(MarketType)) {
			const seg = segmentsData.find(s => s.id === type);
			if (!seg) {
				continue;
			}

			if (!isAllSelectedInSegment(type)) {
				return false;
			}
		}

		return true;
	});

	const selectedSegmentRequest = computed<ISegmentRequest>(() => {
		if (isAllSelected.value) {
			return {
				selectAllFrom: ['all'],
				selectTickers: [],
				isAllTickersShow: true,
			};
		}

		const selectAllFrom: SelectAllFrom[] = [];
		const selectTickers: string[] = [];

		for (const segment of segments.value) {
			const selected = selectedSegmentTickers.value[segment.id] ?? new Set();
			const allIds = segment.tickers.map(t => utils.parseTicker(segment.id, t));

			if (selected.size === allIds.length) {
				selectAllFrom.push(segment.id);
			} else {
				for (const t of selected) {
					selectTickers.push(t);
				}
			}
		}

		return {
			selectAllFrom,
			selectTickers,
			isAllTickersShow: false,
		};
	});

	function isAllSelectedInSegment(segmentId: MarketType): boolean {
		return utils.isAllSelectedInSegment(segmentId, segments.value, selectedSegmentTickers.value);
	}

	function toggleTicker(segmentId: MarketType, tickerId: string) {
		const seg = selectedSegmentTickers.value[segmentId] ?? new Set();

		if (seg.has(tickerId)) {
			seg.delete(tickerId);
		} else {
			seg.add(tickerId);
		}
		selectedSegmentTickers.value = {
			...selectedSegmentTickers.value,
			[segmentId]: seg,
		};
	}

	function selectAll(segmentId: MarketType) {
		const seg = segments.value.find((s) => s.id === segmentId);

		if (!seg) {
			return;
		}

		selectedSegmentTickers.value = {
			...selectedSegmentTickers.value,
			[segmentId]: new Set(seg.tickers.map((t) => utils.parseTicker(segmentId, t))),
		};
	}

	function unselectAll(segmentId: MarketType) {
		const copy = { ...selectedSegmentTickers.value };
		delete copy[segmentId];
		selectedSegmentTickers.value = copy;
	}

	function hasInSegment(segmentId: MarketType, ticker: ITickerData) {
		return utils.hasInSegment(segmentId, ticker, selectedSegmentTickers.value);
	}

	return {
		segments,
		isAllSelected,
		selectedSegmentRequest,
		selectedSegmentTickers,
		isAllSelectedInSegment,
		toggleTicker,
		selectAll,
		unselectAll,
		hasInSegment,
	};
}

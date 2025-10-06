import { computed, type MaybeRefOrGetter, ref, toValue, watch } from 'vue';

import { MarketType } from '@/modules/market';
import type { ITickerData } from '@/shared/mock';
import {
	type ISegmentRequest,
	type SelectAllFrom,
	type SelectedSegmentTickersState,
} from '@/modules/news/model';
import { segmentsData } from '@/modules/news/model/segment-modal';
import * as utils from '@/modules/news/utils';

export function useSegment(selectedSegments: MaybeRefOrGetter<Set<MarketType>>) {
	const selectedSegmentTickers = ref<SelectedSegmentTickersState>({});

	const segments = computed(() => {
		const selected = toValue(selectedSegments);

		if (!selected || selected.size === 0) {
			return segmentsData;
		}

		return segmentsData.filter((s) => selected.has(s.id));
	});

	watch(segments, (segment) => {
		const validIds = new Set(segment.map((s) => s.id));

		const filtered: Record<string, Set<string>> = {};
		for (const [id, set] of Object.entries(selectedSegmentTickers.value)) {
			if (validIds.has(id as MarketType)) {
				filtered[id] = set;
			}
		}

		if (Object.keys(filtered).length !== Object.keys(selectedSegmentTickers.value).length) {
			selectedSegmentTickers.value = filtered;
		}
	});

	const isAllSelected = computed((): boolean => {
		const hasAny = Object.values(selectedSegmentTickers.value ?? {}).some(
			s => s && s.size > 0,
		);

		if (!hasAny) {
			return true;
		}

		return segments.value.every((s) => isAllSelectedInSegment(s.id));
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

			const allIds = segment.tickers.map((t) =>
				utils.parseTicker(segment.id, t),
			);

			if (selected.size === 0) {
				continue;
			}

			if (selected.size === allIds.length) {
				selectAllFrom.push(segment.id as SelectAllFrom);
			} else {
				for (const t of selected) {
					selectTickers.push(t);
				}
			}
		}

		if (selectAllFrom.length === segments.value.length) {
			return {
				selectAllFrom: ['all'],
				selectTickers: [],
				isAllTickersShow: true,
			};
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

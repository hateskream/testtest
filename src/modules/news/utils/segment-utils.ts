import { MarketType } from '@/modules/market';
import type { ITickerData } from '@/shared/mock';
import type { SelectedSegmentTickersState } from '@/modules/news';

export function parseTicker(segmentId: MarketType, ticker: ITickerData) {
	return segmentId === MarketType.Forex ? `${ticker.left}${ticker.right}` : ticker.left;
}

export function isAllSelectedInSegment(
	segmentId: MarketType,
	segments: { id: MarketType; tickers: ITickerData[] }[],
	selected: SelectedSegmentTickersState,
): boolean {
	const seg = segments.find(s => s.id === segmentId);
	if (!seg) {
		return false;
	}

	const selectedSet = selected[segmentId] ?? new Set<string>();
	const allIds = seg.tickers.map(t => parseTicker(segmentId, t));

	return selectedSet.size === allIds.length;
}

export function hasInSegment(
	segmentId: MarketType,
	ticker: ITickerData,
	selected: SelectedSegmentTickersState,
): boolean {
	return selected[segmentId]?.has(parseTicker(segmentId, ticker)) ?? false;
}

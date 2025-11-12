import { MarketType } from '@/modules/market';
import type { ITickerData } from '@/shared/mock';
import type { ISegmentData, SelectedSegmentTickersState } from '@/modules/news';

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

export function getSegmentsTitleStr(
	segments: ISegmentData[],
	selected: SelectedSegmentTickersState,
	showItems = 2,
) {
	const segmentItems: string[] = [];
	const tickerItems: string[] = [];

	for (const segment of segments) {
		if (isAllSelectedInSegment(segment.id, segments, selected)) {
			segmentItems.push(segment.label);
			continue;
		}

		for (const ticker of segment.tickers) {
			if (hasInSegment(segment.id, ticker, selected)) {
				tickerItems.push(parseTicker(segment.id, ticker));
			}
		}
	}

	const items = [...segmentItems, ...tickerItems];
	if (items.length > showItems) {
		const visible = items.slice(0, showItems).join(', ');
		const rest = `+${items.length - showItems}`;
		return `${visible} ${rest}`;
	}

	return items.join(', ');
}

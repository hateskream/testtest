import { getTickersByMarketType, type ITickerData } from '@/shared/mock';
import { MarketType } from '@/modules/market';

export enum SegmentFilterIds {
	All = 'all',
	Selected = 'selected',
}

export interface ISegmentFilters {
	id: SegmentFilterIds;
	label: string;
	amount?: number;
}

export const segmentFilters: ISegmentFilters[] = [
	{
		id: SegmentFilterIds.All,
		label: 'All tickers',
		amount: 12312,
	},
	{
		id: SegmentFilterIds.Selected,
		label: 'Selected',
		amount: 12312,
	},
];

export type SelectAllFrom = MarketType | 'all';

export type SelectedSegmentTickersState = Record<string, Set<string>>;

export interface ISegmentData {
	id: MarketType;
	label: string;
	tickers: ITickerData[];
}

export interface ISegmentRequest {
	selectedTickers: string[];
	excludedTickers: string[];
	selectedMarkets: MarketType[];
}

export const segmentsData: ISegmentData[] = [
	{
		id: MarketType.Crypto,
		label: 'Crypto',
		tickers: [],
	},
	{
		id: MarketType.Stock,
		label: 'Stock',
		tickers: [],
	},
	{
		id: MarketType.Forex,
		label: 'Forex',
		tickers: [],
	},
	{
		id: MarketType.Commodities,
		label: 'Commodities',
		tickers: [],
	},
	{
		id: MarketType.Indices,
		label: 'Indices',
		tickers: [],
	},
];

export async function ensureSegmentsTickersLoaded() {
	const needFetch = segmentsData.filter(seg => seg.tickers.length === 0);

	if (needFetch.length === 0) {
		return;
	}

	const promises = needFetch.map(seg => getTickersByMarketType(seg.id));
	const results = await Promise.all(promises);

	for (let i = 0; i < needFetch.length; i+=1) {
		needFetch[i].tickers = results[i];
	}
}

// TODO: Normally preload these data in some root file
ensureSegmentsTickersLoaded();


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

	if (!Object.values(selected).length) {
		return '';
	}

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

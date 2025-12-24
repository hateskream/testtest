import { MarketType } from '@/modules/market';
import { IconIds } from '@/shared/ui/icon';

export interface IMarketTickerItem<M extends MarketType = MarketType> {
	id: string;
	market_type: M;
	label: string;
	icon: IconIds;
}

export type IMarketTickerStateItem<M extends readonly MarketType[] = MarketType[]> =
	Map<M[number], IMarketTickerItem<M[number]>>;

export const MARKET_TICKER_ITEMS: IMarketTickerItem[] = [
	{
		id: 'Crypto',
		market_type: MarketType.Crypto,
		label: 'All cryptocurrencies',
		icon: IconIds.Cryptos,
	},
	{
		id: 'Stock',
		market_type: MarketType.Stock,
		label: 'All stocks',
		icon: IconIds.SelectAll,
	},
	{
		id: 'Forex',
		market_type: MarketType.Forex,
		label: 'All forex pairs',
		icon: IconIds.SelectAll,
	},
	{
		id: 'Commodities',
		market_type: MarketType.Commodities,
		label: 'All commodities',
		icon: IconIds.SelectAll,
	},
	{
		id: 'Indices',
		market_type: MarketType.Indices,
		label: 'All indices',
		icon: IconIds.SelectAll,
	},
];

export const MARKET_TICKER_ITEMS_BY_MARKET = new Map(
	MARKET_TICKER_ITEMS.map(i => [i.market_type, i]),
);

export function createSelectedMarketTickersMap<
	M extends readonly MarketType[],
>(
	items?: IMarketTickerItem<M[number]>[],
) {
	const map = new Map<M[number], IMarketTickerItem<M[number]>>();

	if (!items?.length) {
		return map;
	}

	for (const item of items) {
		map.set(item.market_type as M[number], item);
	}

	return map;
}

export function flattenSelectedMarketTickersMap<
	M extends readonly MarketType[],
>(
	map?: Map<M[number], IMarketTickerItem<M[number]>>,
) {
	if (!map || map.size === 0) {
		return [];
	}

	return Array.from(map.values());
}

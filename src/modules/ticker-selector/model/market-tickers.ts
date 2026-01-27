import { MarketType } from '@/modules/market';
import { IconIds } from '@/shared/ui/icon';

export interface IMarketTickerItem<M extends MarketType = MarketType> {
	id: string;
	market_type: M;
	label: string;
	icon: IconIds;
}

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
	{
		id: 'Etf',
		market_type: MarketType.Etf,
		label: 'All ETFs',
		icon: IconIds.SelectAll,
	},
];

export const MARKET_TICKER_ITEMS_BY_MARKET = new Map(
	MARKET_TICKER_ITEMS.map(i => [i.market_type, i]),
);

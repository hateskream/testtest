import type {
	ActivityMetricsResponse,
	ICommodityActivityMetricsResponse,
	ICryptoActivityMetricsResponse,
	IEtfActivityMetricsResponse,
	IForexActivityMetricsResponse,
	IIndexActivityMetricsResponse,
	IStockActivityMetricsResponse,
} from './contract';
import type {
	ActivityMetrics,
	ActivityMetricsSentiment,
	ICommodityActivityMetrics,
	ICryptoActivityMetrics,
	IEtfActivityMetrics,
	IForexActivityMetrics,
	IIndexActivityMetrics,
	IStockActivityMetrics,
} from '../model';
import { getTickerIdMarket, type TickerId, TickerMarket, toTickerId } from '@/modules/ticker';

export function mapActivityMetricsResponseToModel(response: ActivityMetricsResponse): ActivityMetrics {
	const tickerId = toTickerId(response.ticker_id);
	const market = getTickerIdMarket(tickerId);

	switch (market) {
		case TickerMarket.CRYPTO: {
			return mapCryptoActivityMetrics(response as ICryptoActivityMetricsResponse);
		}
		case TickerMarket.STOCK: {
			return mapStockActivityMetrics(response as IStockActivityMetricsResponse);
		}
		case TickerMarket.ETF: {
			return mapEtfActivityMetrics(response as IEtfActivityMetricsResponse);
		}
		case TickerMarket.INDEX: {
			return mapIndexActivityMetrics(response as IIndexActivityMetricsResponse);
		}
		case TickerMarket.COMMODITY: {
			return mapCommodityActivityMetrics(response as ICommodityActivityMetricsResponse);
		}
		case TickerMarket.FOREX: {
			return mapForexActivityMetrics(response as IForexActivityMetricsResponse);
		}
		default: {
			throw new Error('Unsupported activity metrics response');
		}
	}
}

function mapCryptoActivityMetrics(response: ICryptoActivityMetricsResponse): ICryptoActivityMetrics {
	return {
		tickerId: response.ticker_id as TickerId,
		marketCap: response.market_cap,
		volume24h: response.volume_24h,
		fdv: response.fdv,
		volToMktCap24h: response.vol_to_mkt_cap_24h,
		totalSupply: response.total_supply,
		sentiment: response.sentiment as ActivityMetricsSentiment,
	};
}

function mapStockActivityMetrics(response: IStockActivityMetricsResponse): IStockActivityMetrics {
	return {
		tickerId: response.ticker_id as TickerId,
		marketCap: response.market_cap,
		volume24h: response.volume_24h,
		totalReturn3m: response.total_return_3m,
		totalReturn1y: response.total_return_1y,
		forwardPe: response.forward_pe,
		sector: response.sector,
	};
}

function mapEtfActivityMetrics(response: IEtfActivityMetricsResponse): IEtfActivityMetrics {
	return {
		tickerId: response.ticker_id as TickerId,
		marketCap: response.market_cap,
		avgVolume: response.avg_volume,
		beta: response.beta,
		topHolding: response.top_holding,
		numSectors: response.num_sectors,
	};
}

function mapIndexActivityMetrics(response: IIndexActivityMetricsResponse): IIndexActivityMetrics {
	return {
		tickerId: response.ticker_id as TickerId,
		volume24h: response.volume_24h,
		sector: response.sector,
	};
}

function mapCommodityActivityMetrics(response: ICommodityActivityMetricsResponse): ICommodityActivityMetrics {
	return {
		tickerId: response.ticker_id as TickerId,
		volume24h: response.volume_24h,
	};
}

function mapForexActivityMetrics(response: IForexActivityMetricsResponse): IForexActivityMetrics {
	return {
		tickerId: response.ticker_id as TickerId,
		volume24h: response.volume_24h,
	};
}


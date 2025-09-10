import { SymbolType } from '@/modules/cell';
import type { ITickerMapped, TickerDto } from '../model';

export function getMappedRow(item: TickerDto): ITickerMapped {
	switch (item.symbol.symbolType) {
		case SymbolType.Crypto:
			return {
				tickerId: item.tickerId,
				srcImage: item.symbol.srcImg,
				name: item.symbol.blockchain,
				ticker: item.symbol.ticker,
				symbolType: item.symbol.symbolType,
			};

		case SymbolType.Stock:
			return {
				tickerId: item.tickerId,
				srcImage: item.symbol.srcImg,
				name: item.symbol.companyName,
				ticker: item.symbol.ticker,
				symbolType: item.symbol.symbolType,
			};

		case SymbolType.Commodity:
			return {
				tickerId: item.tickerId,
				srcImage: item.symbol.srcImg,
				name: item.symbol.commodityName,
				ticker: item.symbol.ticker,
				symbolType: item.symbol.symbolType,
			};

		case SymbolType.Forex:
			return {
				tickerId: item.tickerId,
				srcImage: [item.symbol.leftSrcImg, item.symbol.rightSrcImg],
				name: '',
				ticker:
					item.symbol.leftTicker && item.symbol.rightTicker ?
					`${item.symbol.leftTicker}/${item.symbol.rightTicker}` :
						'N/A',
				symbolType: item.symbol.symbolType,
			};

		case SymbolType.Index:
			return {
				srcImage: item.symbol.srcImg,
				tickerId: item.tickerId,
				name: item.symbol.indexName,
				ticker: item.symbol.ticker,
				symbolType: item.symbol.symbolType,
			};


		default:
			return {
				srcImage: null,
				tickerId: item.tickerId,
				name: item.symbol.cellType,
				ticker: item.tickerId,
				symbolType: item.symbol.symbolType,
			};
	}
}

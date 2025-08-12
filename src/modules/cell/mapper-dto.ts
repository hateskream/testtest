import {
	CellType,
	SymbolType,
	type ICommoditySymbolCell,
	type ICryptoSymbolCell,
	type IEmptyCell,
	type IForexSymbolCell,
	type IIndexSymbolCell,
	type INumberCell,
	type IPercentCell,
	type IRangeCell,
	type IStockSymbolCell,
	type ISvgChartCell,
	type ISymbolCell,
	type ITextCell,
} from './domain';
import type {
	CellDto,
	ICommoditySymbolDto,
	ICryptoSymbolDto,
	IForexSymbolDto,
	IIndexSymbolDto,
	IStockSymbolDto,
	NumberDto,
	PercentDto,
	RangeDto,
	SvgChartDto,
	SymbolDto,
	TextDto,
} from './dto';

export function mapSymbol(dto: CellDto): ISymbolCell | IEmptyCell {
	if (isEmpty(dto)) {
		createEmpty(dto);
	}

	if (isSymbolDto(dto)) {
		const base = {
			cellType: dto.cellType,
			columnType: dto.columnType,
			symbolType: dto.symbolType,
		};

		if (isIndexSymbolDto(dto)) {
			return {
				...base,
				srcImg: dto.srcImg!,
				ticker: dto.ticker!,
				indexName: dto.indexName!,
			} as IIndexSymbolCell;
		}

		if (isCommoditySymbolDto(dto)) {
			return {
				...base,
				srcImg: dto.srcImg!,
				ticker: dto.ticker!,
				commodityName: dto.commodityName!,
			} as ICommoditySymbolCell;
		}

		if (isStockSymbolDto(dto)) {
			return {
				...base,
				srcImg: dto.srcImg!,
				ticker: dto.ticker!,
				companyName: dto.companyName!,
			} as IStockSymbolCell;
		}

		if (isCryptoSymbolDto(dto)) {
			return {
				...base,
				srcImg: dto.srcImg!,
				ticker: dto.ticker!,
				blockchain: dto.blockchain!,
			} as ICryptoSymbolCell;
		}

		if (isForexSymbolDto(dto)) {
			return {
				...base,
				rightSrcImg: dto.rightSrcImg!,
				leftSrcImg: dto.leftSrcImg!,
				rightTicker: dto.rightTicker!,
				leftTicker: dto.leftTicker!,
			} as IForexSymbolCell;
		}
	}

	// eslint-disable-next-line no-console
	console.error('Cell not match Symbol', dto);
	return createEmpty(dto);
}

export function mapNumber(dto: CellDto): INumberCell | IEmptyCell {
	if (isEmpty(dto)) {
		createEmpty(dto);
	}

	if (isNumberDto(dto)) {
		return {
			cellType: CellType.Number,
			columnType: dto.columnType,
			magnitude: dto.magnitude,
			currencySymbol: dto.currencySymbol,
			value: dto.value,
			trend: dto.trend,
		} as INumberCell;
	}

	// eslint-disable-next-line no-console
	console.error('Cell not match Number', dto);
	return createEmpty(dto);
}

export function mapPercent(dto: CellDto): IPercentCell | IEmptyCell {
	if (isEmpty(dto)) {
		createEmpty(dto);
	}

	if (isPercentDto(dto)) {
		return {
			cellType: CellType.Percent,
			columnType: dto.columnType,
			value: dto.value,
			trend: dto.trend,
		} as IPercentCell;
	}

	// eslint-disable-next-line no-console
	console.error('Cell not match Percent', dto);
	return createEmpty(dto);
}

export function mapText(dto: CellDto): ITextCell | IEmptyCell {
	if (isEmpty(dto)) {
		return createEmpty(dto);
	}

	if (isTextDto(dto)) {
		return {
			cellType: CellType.Text,
			columnType: dto.columnType,
			value: dto.value,
		} as ITextCell;
	}

	// eslint-disable-next-line no-console
	console.error('Cell not match Text', dto);
	return createEmpty(dto);
}

export function mapRange(dto: CellDto): IRangeCell | IEmptyCell {
	if (isEmpty(dto)) {
		return createEmpty(dto);
	}

	if (isRangeDto(dto)) {
		return {
			cellType: CellType.Range,
			columnType: dto.columnType,
			currencySymbol: dto.currencySymbol,
			startValue: dto.startValue,
			endValue: dto.endValue,
			startMagnitude: dto.startMagnitude,
			endMagnitude: dto.endMagnitude,
		} as IRangeCell;
	}

	// eslint-disable-next-line no-console
	console.error('Cell not match Range', dto);
	return createEmpty(dto);
}

export function mapSvgChart(dto: CellDto): ISvgChartCell | IEmptyCell {
	if (isEmpty(dto)) {
		return createEmpty(dto);
	}

	if (isSvgChartDto(dto)) {
		return {
			cellType: CellType.SvgChart,
			columnType: dto.columnType,
			src: dto.src,
		} as ISvgChartCell;
	}

	// eslint-disable-next-line no-console
	console.error('Cell not match SvgChart', dto);
	return createEmpty(dto);
}

function isIndexSymbolDto(dto: CellDto): dto is IIndexSymbolDto {
	return (
		dto.cellType === CellType.Symbol &&
		'symbolType' in dto &&
		dto.symbolType === SymbolType.Index
	);
}

function isCommoditySymbolDto(dto: CellDto): dto is ICommoditySymbolDto {
	return (
		dto.cellType === CellType.Symbol &&
		'symbolType' in dto &&
		dto.symbolType === SymbolType.Commodity
	);
}

function isStockSymbolDto(dto: CellDto): dto is IStockSymbolDto {
	return (
		dto.cellType === CellType.Symbol &&
		'symbolType' in dto &&
		dto.symbolType === SymbolType.Stock
	);
}

function isCryptoSymbolDto(dto: CellDto): dto is ICryptoSymbolDto {
	return (
		dto.cellType === CellType.Symbol &&
		'symbolType' in dto &&
		dto.symbolType === SymbolType.Crypto
	);
}

function isForexSymbolDto(dto: CellDto): dto is IForexSymbolDto {
	return (
		dto.cellType === CellType.Symbol &&
		'symbolType' in dto &&
		dto.symbolType === SymbolType.Forex
	);
}

function isSymbolDto(dto: CellDto): dto is SymbolDto {
	return dto.cellType === CellType.Symbol;
}

function isNumberDto(dto: CellDto): dto is NumberDto {
	return dto.cellType === CellType.Number;
}

function isPercentDto(dto: CellDto): dto is PercentDto {
	return dto.cellType === CellType.Percent;
}

function isSvgChartDto(dto: CellDto): dto is SvgChartDto {
	return dto.cellType === CellType.SvgChart;
}

function isTextDto(dto: CellDto): dto is TextDto {
	return dto.cellType === CellType.Text;
}

function isRangeDto(dto: CellDto): dto is RangeDto {
	return dto.cellType === CellType.Range;
}

function createEmpty(dto: CellDto): IEmptyCell {
	return {
		cellType: CellType.Empty,
		columnType: dto.columnType,
	};
}

function isEmpty(dto: CellDto): boolean {
	const keys = Object.keys(dto);
	for (const key of keys) {
		if (key === 'cellType' || key === 'columnType') {
			continue;
		}
		if (dto[key as keyof typeof dto] != null) {
			return false;
		}
	}

	return true;
}

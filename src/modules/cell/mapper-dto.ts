import {
	CellType,
	type ICheckCell,
	type ICommoditySymbolCell,
	type ICryptoSymbolCell,
	type IEmptyCell,
	type IForexSymbolCell,
	type IIndexSymbolCell,
	type ILableCell,
	type INumberCell,
	type IOpenCell,
	type IPercentCell,
	type IPlaneTextSymbolCell,
	type IRangeCell,
	type IScheduleCell,
	type IScoreCell,
	type IStockSymbolCell,
	type ISvgChartCell,
	type ISymbolCell,
	type ITextCell,
	SymbolType,
} from './domain';
import type {
	CellDto,
	CheckDto,
	ICommoditySymbolDto,
	ICryptoSymbolDto,
	IForexSymbolDto,
	IIndexSymbolDto,
	IPlaneTextSymbolDto,
	IStockSymbolDto,
	LabelDto,
	NumberDto,
	OpenDto,
	PercentDto,
	RangeDto,
	ScheduleDto,
	ScoreDto,
	SvgChartDto,
	SymbolDto,
	TextDto,
} from './dto';
import { useLogger } from '@/shared/service/monitoring';


export function mapSymbol(dto: CellDto): ISymbolCell | IEmptyCell {
	if (isEmpty(dto)) {
		return createEmpty(dto);
	}

	if (isSymbolDto(dto)) {
		const base = {
			cellType: dto.cellType,
			columnType: dto.columnType,
			symbolType: dto.symbolType,
			...(dto.tickerDisplayName ? { tickerDisplayName: dto.tickerDisplayName } : {}),
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

		if (isPlaneTextSymbolDto(dto)) {
			return {
				...base,
				text: dto.text!,
			} as IPlaneTextSymbolCell;
		}

	}

	const logger = useLogger();
	logger.error('Cell not match Symbol', { context: { dto } });

	return createEmpty(dto);
}

export function mapNumber(dto: CellDto): INumberCell | IEmptyCell {
	if (isEmpty(dto)) {
		return createEmpty(dto);
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

	const logger = useLogger();
	logger.error('Cell not match Number', { context: { dto } });

	return createEmpty(dto);
}

export function mapPercent(dto: CellDto): IPercentCell | IEmptyCell {
	if (isEmpty(dto)) {
		return createEmpty(dto);
	}

	if (isPercentDto(dto)) {
		return {
			cellType: CellType.Percent,
			columnType: dto.columnType,
			value: dto.value,
			trend: dto.trend,
			maxAbsValue: dto.maxAbsValue,
		} as IPercentCell;
	}

	const logger = useLogger();
	logger.error('Cell not match Percent', { context: { dto } });

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

	const logger = useLogger();
	logger.error('Cell not match Text', { context: { dto } });

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

	const logger = useLogger();
	logger.error('Cell not match Range', { context: { dto } });

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

	const logger = useLogger();
	logger.error('Cell not match SvgChart', { context: { dto } });

	return createEmpty(dto);
}

export function mapLabel(dto: CellDto): ILableCell | IEmptyCell {
	if (isEmpty(dto)) {
		return createEmpty(dto);
	}

	if (isLabelDto(dto)) {
		return {
			cellType: CellType.Label,
			columnType: dto.columnType,
			value: dto.value,
			status: dto.status,
		} as ILableCell;
	}

	const logger = useLogger();
	logger.error('Cell not match Label', { context: { dto } });

	return createEmpty(dto);
}

export function mapScore(dto: CellDto): IScoreCell | IEmptyCell {
	if (isEmpty(dto)) {
		return createEmpty(dto);
	}
	if (isScoreDto(dto)) {
		return {
			cellType: CellType.Score,
			columnType: dto.columnType,
			value: dto.value,
			score: dto.score,
		} as IScoreCell;
	}
	return createEmpty(dto);
}


export function mapOpen(dto: CellDto): IOpenCell | IEmptyCell {
	if (isEmpty(dto)) {
		return createEmpty(dto);
	}
	if (isIsOpenDto(dto)) {
		return {
			cellType: CellType.Open,
			columnType: dto.columnType,
			value: dto.value,

		} as IOpenCell;
	}
	return createEmpty(dto);
}


export function mapCheck(dto: CellDto): ICheckCell | IEmptyCell {
	if (isEmpty(dto)) {
		return createEmpty(dto);
	}
	if (isCheckDto(dto)) {
		return {
			cellType: CellType.Check,
			columnType: dto.columnType,
			value: dto.value,

		} as ICheckCell;
	}
	return createEmpty(dto);
}


export function mapSchedule(dto: CellDto): IScheduleCell | IEmptyCell {
	if (isEmpty(dto)) {
		return createEmpty(dto);
	}
	if (isScheduleDto(dto)) {
		return {
			cellType: CellType.Schedule,
			columnType: dto.columnType,
			start: dto.start,
			finish: dto.finish,
			current: dto.current,

		} as IScheduleCell;
	}
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

function isPlaneTextSymbolDto(dto: CellDto): dto is IPlaneTextSymbolDto {
	return (
		dto.cellType === CellType.Symbol &&
		'symbolType' in dto &&
		dto.symbolType === SymbolType.PlaneText
	);
}

function isScoreDto(dto: CellDto): dto is ScoreDto {
	return dto.cellType === CellType.Score;
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

function isLabelDto(dto: CellDto): dto is LabelDto {
	return dto.cellType === CellType.Label;
}

function isIsOpenDto(dto: CellDto): dto is OpenDto {
	return dto.cellType === CellType.Open;
}


function isCheckDto(dto: CellDto): dto is CheckDto {
	return dto.cellType === CellType.Check;
}

function isScheduleDto(dto: CellDto): dto is ScheduleDto {
	return dto.cellType === CellType.Schedule;
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

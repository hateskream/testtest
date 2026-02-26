import { z } from 'zod';

import { TickerType } from '@/modules/ticker';

export const PriceRangePreset = {
	Day: '1D',
	Week: '1W',
	Month: '1M',
	ThreeMonth: '3M',
	Year: '1Y',
} as const;

const PriceRangePresetSchema = z.nativeEnum(PriceRangePreset);
export type PriceRangePresetType = z.infer<typeof PriceRangePresetSchema>;

const PriceRangeSchema = z.object({
	min: z.number(),
	max: z.number(),
	start: z.number(),
});

const PriceRangesSchema = z.object({
	[PriceRangePreset.Day]: PriceRangeSchema,
	[PriceRangePreset.Week]: PriceRangeSchema,
	[PriceRangePreset.Month]: PriceRangeSchema,
	[PriceRangePreset.ThreeMonth]: PriceRangeSchema,
	[PriceRangePreset.Year]: PriceRangeSchema,
});

const AllTimeHighSchema = z.object({
	allTimeHighAbs: z.number(),
	allTimeHighDate: z.string(),
	allTimeHighPerc: z.number(),
});

const AllTimeLowSchema = z.object({
	allTimeLowAbs: z.number(),
	allTimeLowDate: z.string(),
	allTimeLowPerc: z.number(),
});

const BasePricePerformanceSchema = z.object({
	tickerId: z.string(),
	isOpen: z.boolean(),
	lastUpdate: z.string(),
	openTime: z.string(),
	value: z.number(),
	valueChangeAbs: z.number(),
	valueChangePerc: z.number(),
	changeIsPositive: z.boolean(),
	average50: z.number().optional(),
	average200: z.number().optional(),
	openPrice: z.number(),
	previousClose: z.number(),
	prefix: z.string(),
	suffix: z.string().optional(),
	ranges: PriceRangesSchema.optional(),
	ath: AllTimeHighSchema.optional(),
	atl: AllTimeLowSchema.optional(),
});

export const CryptoPricePerformanceSchema = BasePricePerformanceSchema.extend({
	marketType: z.literal(TickerType.CRYPTO),
});

export const StockPricePerformanceSchema = BasePricePerformanceSchema.extend({
	marketType: z.literal(TickerType.STOCK),
});

export const IndexPricePerformanceSchema = BasePricePerformanceSchema.extend({
	marketType: z.literal(TickerType.INDICES),
});

export const ForexPricePerformanceSchema = BasePricePerformanceSchema.extend({
	marketType: z.literal(TickerType.FOREX),
});

export const CommodityPricePerformanceSchema = BasePricePerformanceSchema.extend({
	marketType: z.literal(TickerType.COMMODITIES),
});

export const EtfPricePerformanceSchema = BasePricePerformanceSchema.extend({
	marketType: z.literal(TickerType.ETF),
});


export const PricePerformanceSchema = z.discriminatedUnion('marketType', [
	CryptoPricePerformanceSchema,
	StockPricePerformanceSchema,
	IndexPricePerformanceSchema,
	CommodityPricePerformanceSchema,
	ForexPricePerformanceSchema,
	EtfPricePerformanceSchema,
]);

export type PricePerformance = z.infer<typeof PricePerformanceSchema>;



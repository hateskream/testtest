import { z } from 'zod';

import { TickerType } from '@/modules/ticker';

/**
 * Subsector
 */
const SubSectorSchema = z.object({
	subSectorName: z.string(),
	subSectorDisplayName: z.string(),
	value: z.number(),
	color: z.string(),
});

/**
 * Sector
 */
const SectorSchema = z.object({
	sectorName: z.string(),
	sectorDisplayName: z.string(),
	value: z.number(),
	color: z.string(),
	subsectors: z.array(SubSectorSchema).optional(),
});

export type Sector = z.infer<typeof SectorSchema>;

/**
 * Base
 */
const BaseSectorsSchema = z.object({
	tickerId: z.string(),
	lastUpdate: z.string().optional(),
	sectors: z.array(SectorSchema),
});

/**
 * Market-specific schemas
 */
export const CryptoSectorsSchema = BaseSectorsSchema.extend({
	marketType: z.literal(TickerType.CRYPTO),
});

export const StockSectorsSchema = BaseSectorsSchema.extend({
	marketType: z.literal(TickerType.STOCK),
});

export const IndexSectorsSchema = BaseSectorsSchema.extend({
	marketType: z.literal(TickerType.INDICES),
});

export const ForexSectorsSchema = BaseSectorsSchema.extend({
	marketType: z.literal(TickerType.FOREX),
});

export const CommoditySectorsSchema = BaseSectorsSchema.extend({
	marketType: z.literal(TickerType.COMMODITIES),
});

export const EtfSectorsSchema = BaseSectorsSchema.extend({
	marketType: z.literal(TickerType.ETF),
});

/**
 * Union
 */
export const SectorsSchema = z.discriminatedUnion('marketType', [
	CryptoSectorsSchema,
	StockSectorsSchema,
	IndexSectorsSchema,
	CommoditySectorsSchema,
	ForexSectorsSchema,
	EtfSectorsSchema,
]);

export type Sectors = z.infer<typeof SectorsSchema>;

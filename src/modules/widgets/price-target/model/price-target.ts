import { z } from 'zod';

import type { ObjectEnum } from '@/shared/types';

export const PriceTargetHistoryPointSchema = z.object({
	timestamp: z.string(),
	close: z.number(),
});

export type PriceTargetHistoryPoint = z.infer<typeof PriceTargetHistoryPointSchema>;

export const PriceTargetValuesSchema = z.object({
	high: z.number(),
	low: z.number(),
	average: z.number(),
});

export type PriceTargetValues = z.infer<typeof PriceTargetValuesSchema>;

export const PriceTargetSchema = z.object({
	tickerId: z.string(),
	target: PriceTargetValuesSchema,
	history: z.array(PriceTargetHistoryPointSchema).nonempty(),
});

export type PriceTarget = z.infer<typeof PriceTargetSchema>;

export function getCurrentPrice(data: PriceTarget): number {
	if (data.history.length === 0) {
		return 0;
	}

	return data.history[data.history.length - 1].close;
}

export function getPotentialPercent(data: PriceTarget): number {
	const currentPrice = getCurrentPrice(data);
	return ((data.target.average - currentPrice) / currentPrice) * 100;
}

export const PotentialDirection = {
	Up: 'up',
	Down: 'down',
} as const;

export type PotentialDirectionType = ObjectEnum<typeof PotentialDirection>;

export function getPotentialDirection(data: PriceTarget): PotentialDirectionType {
	const currentPrice = getCurrentPrice(data);
	return data.target.average >= currentPrice ? PotentialDirection.Up : PotentialDirection.Down;
}

import { z } from 'zod';

export const TradingVolumeSentiment = {
	Positive: 'positive',
	Negative: 'negative',
	Neutral: 'neutral',
} as const;

export type TradingVolumeSentimentType = (typeof TradingVolumeSentiment)[keyof typeof TradingVolumeSentiment];

export const TradingVolumePeriodSchema = z.object({
	period: z.string(),
	change: z.number(),
	status: z.nativeEnum(TradingVolumeSentiment),
});

export const TradingVolumeSentimentSchema = z.object({
	label: z.string(),
	status: z.nativeEnum(TradingVolumeSentiment),
});

export const TradingVolumeSchema = z.object({
	sentiment: TradingVolumeSentimentSchema,
	max_change: z.number(),
	periods: z.array(TradingVolumePeriodSchema).nonempty(),
});

export type TradingVolumePeriod = z.infer<typeof TradingVolumePeriodSchema>;
export type TradingVolumeSentiment = z.infer<typeof TradingVolumeSentimentSchema>;

export type TradingVolume = z.infer<typeof TradingVolumeSchema>;

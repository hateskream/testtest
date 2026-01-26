import { z } from 'zod';

import { IconIds } from '@/shared/ui/icon';

export const ActivityMetricsSentiment = {
	BULLISH: 'Bullish',
	BEARISH: 'Bearish',
	NEUTRAL: 'Neutral',
} as const;

export type ActivityMetricsSentiment = typeof ActivityMetricsSentiment[keyof typeof ActivityMetricsSentiment];

export const ActivityMetricsSentimentSchema = z.nativeEnum(ActivityMetricsSentiment);

const sentimentToColor = {
	[ActivityMetricsSentiment.BULLISH]: 'positive',
	[ActivityMetricsSentiment.BEARISH]: 'negative',
	[ActivityMetricsSentiment.NEUTRAL]: 'neutral',
} as const;

export function getSentimentColor(sentiment: ActivityMetricsSentiment) {
	return sentimentToColor[sentiment];
}

const sentimentToIcon = {
	[ActivityMetricsSentiment.BULLISH]: IconIds.Gainers,
	[ActivityMetricsSentiment.BEARISH]: IconIds.Loosers,
	[ActivityMetricsSentiment.NEUTRAL]: null,
} as const;

export function getSentimentIcon(sentiment: ActivityMetricsSentiment) {
	return sentimentToIcon[sentiment];
}

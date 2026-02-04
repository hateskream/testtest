import type { ISpeedometerSegment } from '@/shared/ui/speedometer';

export const SENTIMENT_SEGMENTS: ISpeedometerSegment[] = [
	{ max: 24, position: 1 },
	{ max: 45, position: 25 },
	{ max: 54, position: 50 },
	{ max: 75, position: 75 },
	{ max: 100, position: 99 },
];

interface ISentimentTextData {
	signal: string;
	description: string;
	color: string;
}

const SENTIMENT_MAP: { max: number; data: ISentimentTextData }[] = [
	{ max: 24, data: { signal: 'Strong Sell', description: 'High Risk, Weakness', color: '#fc1d4d' } },
	{ max: 45, data: { signal: 'Sell', description: 'Caution, Uncertainty', color: '#f77f00' } },
	{ max: 54, data: { signal: 'Neutral', description: 'Mixed Signals', color: '#9a9a9d' } },
	{ max: 75, data: { signal: 'Buy', description: 'Momentum, Opportunity', color: '#04eda0' } },
	{ max: 100, data: { signal: 'Strong Buy', description: 'High Confidence, Strength', color: '#00c853' } },
];

export function mapSentiment(tension: number): ISentimentTextData {
	return SENTIMENT_MAP.find(s => tension <= s.max)?.data ?? SENTIMENT_MAP[SENTIMENT_MAP.length - 1].data;
}

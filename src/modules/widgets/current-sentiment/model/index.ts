import type { ISpeedometerSegment } from '@/shared/ui/speedometer';

export const SENTIMENT_SEGMENTS = [
	{ max: 24, position: 0 },
	{ max: 45, position: 24 },
	{ max: 54, position: 45 },
	{ max: 75, position: 54 },
	{ max: 100, position: 75 },
] as const satisfies ISpeedometerSegment[];

interface ISentimentTextData {
	signal: string;
	description: string;
	color: string;
	shadowColor: string;
}

interface ISentimentMap {
	max: number;
	data: ISentimentTextData;
}

const SENTIMENT_MAP = [
	{
		max: 24,
		data: { signal: 'Strong Sell', description: 'High Risk, Weakness', color: '#F85961', shadowColor: '#FC4A6B' },
	},
	{
		max: 45,
		data: { signal: 'Sell', description: 'Caution, Uncertainty', color: '#FF9151', shadowColor: '#FF9151' },
	},
	{
		max: 54,
		data: { signal: 'Neutral', description: 'Mixed Signals', color: '#DCDCDF', shadowColor: '#DCDCDF' },
	},
	{
		max: 75,
		data: { signal: 'Buy', description: 'Momentum, Opportunity', color: '#92FFDB', shadowColor: '#04EDA0' },
	},
	{
		max: 100,
		data: {
			signal: 'Strong Buy',
			description: 'High Confidence, Strength',
			color: '#98FB0E',
			shadowColor: '#98FB0E',
		},
	},
] as const satisfies ISentimentMap[];

export function mapSentiment(tension: number): ISentimentTextData {
	return SENTIMENT_MAP.find(s => tension <= s.max)?.data ?? SENTIMENT_MAP[SENTIMENT_MAP.length - 1].data;
}

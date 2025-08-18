export enum Sentiment {
	Optimistic = 'optimistic',
	Neutral = 'neutral',
	Pessimistic = 'pessimistic',
};

export const sentimentToName: Readonly<Record<Sentiment, string>> = {
	[Sentiment.Optimistic]: 'Optimistic',
	[Sentiment.Neutral]: 'Neutral',
	[Sentiment.Pessimistic]: 'Pessimistic',
};

export enum Score {
	Low = 'low',
	Medium = 'medium',
	High ='high',
};

export const scoreToName: Readonly<Record<Score, string>> = {
	[Score.Low]: 'Low',
	[Score.Medium]: 'Medium',
	[Score.High]: 'High',
};

export enum Source {
	InvestingCom = 'investing.com',
	Benzinga = 'benzinga',
};

export const sourceToName: Readonly<Record<Source, string>> = {
	[Source.InvestingCom]: 'Investing.com',
	[Source.Benzinga]: 'Benzinga',
};

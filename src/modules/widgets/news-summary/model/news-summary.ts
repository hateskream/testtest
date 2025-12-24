import type { IGetNewsSummaryResponse } from '../api';

export type NewsSummarySentiment = 'neutral' | 'optimistic' | 'pessimistic';

export interface INewsSummaryDomain {
	sentiment: NewsSummarySentiment;
	summary: string;
	summarizedAt: Date;
}

export function mapNewSummaryToDomain(response: IGetNewsSummaryResponse): INewsSummaryDomain {
	return {
		sentiment: response.sentiment,
		summary: response.summary,
		summarizedAt: new Date(response.summarized_at),
	};
}

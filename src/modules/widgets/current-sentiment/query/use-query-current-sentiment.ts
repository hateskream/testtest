import { useQuery } from '@tanstack/vue-query';
import { toValue, type MaybeRefOrGetter } from 'vue';

import { getCurrentSentiment, type ICurrentSentimentRequest } from '../api/get-current-sentiment';

export function useQueryCurrentSentiment(args: MaybeRefOrGetter<ICurrentSentimentRequest>) {
	return useQuery({
		queryKey: ['current-sentiment', args],
		queryFn: () => getCurrentSentiment(toValue(args)),
	});
}

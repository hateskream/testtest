import { useMutation, useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { queryClient } from '@/shared/service/query-client.ts';

export function useNewsDetailsState(identifier: string) {
	const { data: id } = useQuery<string | null>({
		queryKey: ['news-details-state', identifier],
		queryFn: () => queryClient.getQueryData<string>(['news-details-state', identifier]) ?? null,
		initialData: () => queryClient.getQueryData<string>(['news-details-state', identifier]) ?? null,
		staleTime: Infinity,
	});

	const { mutate } = useMutation({
		mutationFn: async (newsId: string | null) => newsId,
		onSuccess: (newId) => {
			queryClient.setQueryData(['news-details-state', identifier], newId);
		},
	});

	const state = computed({
		get: () => id.value,
		set: (newsId: string | null) => mutate(newsId),
	});

	return {
		state,
	};
}

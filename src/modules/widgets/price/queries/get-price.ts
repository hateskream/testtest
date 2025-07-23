import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { computed } from 'vue';

import { getPrice } from '../api';

export function useQueryPrice() {
	return useQuery({
		queryKey: computed(() => ['price']),
		queryFn: () => getPrice(),
		placeholderData: keepPreviousData,
	});
}

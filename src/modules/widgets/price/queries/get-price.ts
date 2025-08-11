import { keepPreviousData, useQuery } from '@tanstack/vue-query';
import { computed, toValue, type MaybeRefOrGetter } from 'vue';

import { getPrice } from '../api';

interface IGetPriceRequest {
	market: string;
	pined: string[];
	offset: number;
	limit: number;
}

export function useQueryPrice(req: MaybeRefOrGetter<IGetPriceRequest>) {
	const { market, pined, offset, limit } = toValue(req);

	return useQuery({
		queryKey: computed(() => ['price', market, offset, limit]),
		queryFn: () => getPrice({
			market,
			pined,
			offset,
			limit,
		}),
		placeholderData: keepPreviousData,
	});
}

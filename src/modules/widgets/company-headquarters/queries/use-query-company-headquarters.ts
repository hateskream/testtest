import { useQuery } from '@tanstack/vue-query';
import { type MaybeRefOrGetter, toValue } from 'vue';

import { getCompanyHeadquarters } from '../api/get-company-headquarters';

export function useQueryCompanyHeadquarters(tickerId: MaybeRefOrGetter<string>) {
	return useQuery({
		queryKey: ['company-headquarters', tickerId],
		queryFn: () => getCompanyHeadquarters({ ticker_id: toValue(tickerId) }),
	});
}

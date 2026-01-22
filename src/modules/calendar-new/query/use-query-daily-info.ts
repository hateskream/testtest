import { toValue, type MaybeRefOrGetter } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import type { IDailyInfoResponse } from '../model/contract';
import { getDailyInfo } from '../api/get-daily-info';

interface IUseQueryDailyInfo {
	from: MaybeRefOrGetter<string>;
	to: MaybeRefOrGetter<string>;
}

export const useQueryDailyInfo = (options: IUseQueryDailyInfo) => {
	return useQuery<IDailyInfoResponse[]>({
		queryKey: ['daily-calendar', options.from, options.to],
		queryFn: () => getDailyInfo({
			from: toValue(options.from),
			to: toValue(options.to),
		}),
		refetchOnMount: false,
	});
};

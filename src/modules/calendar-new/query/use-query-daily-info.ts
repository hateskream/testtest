import { toValue, type MaybeRefOrGetter } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { getDailyInfo } from '../api/get-daily-info';
import type { IDailyInfoResponse } from '../model/calendar';

interface IUseQueryDailyInfo {
	from: MaybeRefOrGetter<string>;
	to: MaybeRefOrGetter<string>;
}

export const useQueryDailyInfo = (options: IUseQueryDailyInfo) => {
	return useQuery<IDailyInfoResponse>({
		queryKey: ['daily-calendar', options.from, options.to],
		queryFn: () => getDailyInfo({
			from: toValue(options.from),
			to: toValue(options.to),
		}),
		refetchOnMount: false,
	});
};

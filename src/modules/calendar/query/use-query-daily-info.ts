import { toValue, type MaybeRefOrGetter } from 'vue';
import { useQuery } from '@tanstack/vue-query';

import { getDailyInfo } from '../api/get-daily-info';
import type { IDailyInfoResponse } from '../model/calendar';

interface IUseQueryDailyInfo {
	from: string;
	to: string;
}

export const useQueryDailyInfo = (options: MaybeRefOrGetter<IUseQueryDailyInfo>) => {
	return useQuery<IDailyInfoResponse>({
		queryKey: ['daily-calendar', options, options],
		queryFn: () => getDailyInfo({
			from: toValue(options).from,
			to: toValue(options).to,
		}),
		refetchOnMount: false,
	});
};

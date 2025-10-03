import { useMutation, useQuery } from '@tanstack/vue-query';

import type { AltcoinSeasonSchemaType, IOptions } from '../services';
import { useRepository } from '../composables';
import { queryClient } from '@/shared/service/query-client.ts';

const ALTCOIN_KEY = 'altcoin-season-config';

export function useAltcoinConfigGetState(widgetId: string, options: IOptions) {
	const repository = useRepository(widgetId, options);

	return useQuery({
		queryKey: [ALTCOIN_KEY, widgetId],
		queryFn: () => repository.get(),
		refetchOnMount: false,
	});
}

export function useAltcoinConfigSetState(widgetId: string, options: IOptions) {
	const repository = useRepository(widgetId, options);

	return useMutation<void, Error, AltcoinSeasonSchemaType>({
		mutationFn: (newSettings) => repository.set(newSettings) as unknown as Promise<void>,
		onMutate: async (newSettings) => {
			await queryClient.cancelQueries({ queryKey: [ALTCOIN_KEY, widgetId] });

			const previousSettings = queryClient.getQueryData<AltcoinSeasonSchemaType>([ALTCOIN_KEY, widgetId]);

			queryClient.setQueryData<AltcoinSeasonSchemaType>([ALTCOIN_KEY, widgetId], newSettings);

			return { previousSettings };
		},

		onError: (_err, _newSettings, context) => {
			const ctx = context as { previousSettings?: AltcoinSeasonSchemaType };

			if (ctx?.previousSettings) {
				queryClient.setQueryData([ALTCOIN_KEY, widgetId], ctx.previousSettings);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [ALTCOIN_KEY, widgetId] });
		},
	});
}

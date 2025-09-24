import { useMutation, useQuery } from '@tanstack/vue-query';

import type { ILocalRepositoryOptions } from '../services';
import { useRepository } from '@/modules/calendar';
import { queryClient } from '@/shared/service/query-client.ts';
import type { ToolbarSchemaType } from '@/modules/calendar/services/schema.ts';

const CALENDAR_TOOLBAR_KEY = 'calendar-toolbar';

export function useToolbarGetState(widgetId: string, options: ILocalRepositoryOptions) {
	const repository = useRepository(widgetId, options);

	return useQuery({
		queryKey: [CALENDAR_TOOLBAR_KEY, widgetId],
		queryFn: () => repository.get(),
		refetchOnMount: false,
	});
}

export const useToolbarUpdateState = (widgetId: string, options: ILocalRepositoryOptions) => {
	const repository = useRepository(widgetId, options);

	return useMutation<void, Error, ToolbarSchemaType>({
		mutationFn: (newSettings) => repository.set(newSettings) as unknown as Promise<void>,
		onMutate: async (newSettings) => {
			await queryClient.cancelQueries({ queryKey: [CALENDAR_TOOLBAR_KEY, widgetId] });

			const previousSettings = queryClient.getQueryData<ToolbarSchemaType>([CALENDAR_TOOLBAR_KEY, widgetId]);

			queryClient.setQueryData<ToolbarSchemaType>([CALENDAR_TOOLBAR_KEY, widgetId], newSettings);

			return { previousSettings };
		},

		onError: (_err, _newSettings, context) => {
			const ctx = context as { previousSettings?: ToolbarSchemaType };

			if (ctx?.previousSettings) {
				queryClient.setQueryData([CALENDAR_TOOLBAR_KEY, widgetId], ctx.previousSettings);
			}
		},

		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: [CALENDAR_TOOLBAR_KEY, widgetId] });
		},
	});
};

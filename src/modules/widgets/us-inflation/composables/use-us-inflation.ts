import { useQueryUsInflation } from '../queries';

interface IOptions {
	widgetId: string;
}

export function useUsInflation({
	widgetId,
}: IOptions) {
	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryUsInflation(widgetId);

	return {
		data,
		isError,
		isLoading,
		refetch,
	};
}

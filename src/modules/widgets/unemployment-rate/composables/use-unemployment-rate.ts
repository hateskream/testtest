import { useQueryUnemploymentRate } from '../queries/use-query-unemployment.ts';

interface IOptions {
	widgetId: string;
}

export function useUnemploymentRate({
	widgetId,
}: IOptions) {


	const {
		data: currentData,
		isLoading,
		isError,
		refetch,
	} = useQueryUnemploymentRate(widgetId);

	return {
		isError,
		isLoading,
		currentData,
		refetch,
	};
}


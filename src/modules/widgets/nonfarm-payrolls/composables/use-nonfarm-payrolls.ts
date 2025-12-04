import { useQueryNonfarmPayrolls } from '../queries/use-query-nonfarm-payrolls';

interface IOptions {
	widgetId: string;
}

export function useNonfarmPayrolls({
	widgetId,
}: IOptions) {


	const {
		data: currentData,
		isLoading,
		isError,
		refetch,
	} = useQueryNonfarmPayrolls(widgetId);

	return {
		isError,
		isLoading,
		currentData,
		refetch,
	};
}


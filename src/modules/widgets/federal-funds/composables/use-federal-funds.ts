import { useQueryFederalFunds } from '../queries';

interface IOptions {
	widgetId: string;
}

export function useFederalFunds({
	widgetId,
}: IOptions) {
	const {
		data,
		isLoading,
		isError,
		refetch,
	} = useQueryFederalFunds(widgetId);

	return {
		data,
		isError,
		isLoading,
		refetch,
	};
}

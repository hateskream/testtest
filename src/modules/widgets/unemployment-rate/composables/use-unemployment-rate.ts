import { useQueryUnemploymentRate } from '../queries/use-query-unemployment.ts';

interface IOptions {
	widgetId: string;
	isEphemeral: boolean;
	defaultStateType: string;
}

export function useUnemploymentRate({
	widgetId,
	isEphemeral,
	defaultStateType,
}: IOptions) {


	const {
		data: currentData,
		isLoading,
		isError,
		refetch,
	} = useQueryUnemploymentRate(widgetId);

	console.log(widgetId, isEphemeral, defaultStateType);
	return {
		isError,
		isLoading,
		currentData,
		refetch,
	};
}


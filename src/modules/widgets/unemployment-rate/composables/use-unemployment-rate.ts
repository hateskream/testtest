import { useQueryUnemploymentRate } from '../queries/use-query-unemployment.ts';

interface IOptions {
	widgetId: string;
}

export function useUnemploymentRate({
	widgetId,
}: IOptions) {
	const {
		data: currentData,
		...rest
	} = useQueryUnemploymentRate(widgetId);

	return {
		currentData,
		...rest,
	};
}

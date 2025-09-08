export type QueryData<T> ={
	pages: T[];
	pageParams: number[];
};

export function updateInfiniteQueryData<TPage>(
	oldData: QueryData<TPage>,
	updatePage: (page: TPage) => TPage,
): QueryData<TPage> {
	return {
		...oldData,
		pages: oldData.pages.map(updatePage),
	};
}

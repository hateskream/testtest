import type { ColumnWithoutSymbol, TableRow } from '@/modules/cell';
import type { Message } from '../service/real-time';

export interface IData {
	tickers: TableRow[];
}

export type QueryData<T = IData> ={
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

export function updateQueryData<T extends ColumnWithoutSymbol>(
	oldData:QueryData<IData>,
	updatedData: Message<T>,
) {
	if (!oldData) {
		return oldData;
	}

	return updateInfiniteQueryData(oldData, (page) => ({
		...page,
		tickers: updateTickers(page.tickers, updatedData),
	}));
}

export function updateTickers<T extends ColumnWithoutSymbol>(
	tickers: TableRow[],
	updatedData: Message<T>,
) {
	return tickers.map((ticker) =>
		ticker.tickerId === updatedData.tickerId
			? {
				...ticker,
				...updatedData,
			}
			: ticker,
	);
}

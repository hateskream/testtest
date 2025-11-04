import type { IGenericTableRow } from '@/modules/table';

export const getCellData = (row: IGenericTableRow<unknown>, columnKey: string): unknown => {
	const data = row.data as Record<string, unknown>;
	return data?.[columnKey];
};

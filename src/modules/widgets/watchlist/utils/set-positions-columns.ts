import type { ITableColumn } from '../model';

export function setPositionColumns(arr: ITableColumn[]) {
	return arr.map((item, idx) => ({ ...item, position: idx }));
}

import type { ITableColumnDirection } from '../model';

export function getNextDirectionSort(
	currentDirection: ITableColumnDirection,
): ITableColumnDirection {
	switch (currentDirection) {
		case 1:
			return -1;

		case -1:
			return 0;

		default:
			return 1;
	}
}

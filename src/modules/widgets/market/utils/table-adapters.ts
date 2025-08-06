// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { IGenericTableColumn, IGenericTableRow } from '@/modules/table';
import type { ITableColumn, ITableRowValueType } from '../model';
import type { IMarketDomain } from '../api';
import { getImagePath } from '@/shared/lib';
import { ImageTypePath } from '@/shared/lib/get-image-path.ts';

function mapMarketTypeToGeneric(type: ITableRowValueType): 'string' | 'number' | 'date' | 'percent' | 'image-string' {
	switch (type) {
		case 'image':
		case 'image-string':
			return 'image-string';
		case 'string':
			return 'string';
		case 'number':
			return 'number';
		case 'percent':
			return 'percent';
		case 'date':
			return 'date';
		default:
			return 'string';
	}
}

export function adaptMarketColumnsToGeneric(marketColumns: ITableColumn[]): IGenericTableColumn[] {
	return marketColumns.map(col => ({
		key: col.columnName,
		label: col.displayColumnName,
		shortLabel: col.displayShortColumnName,
		position: col.position,
		sortable: true,
		draggable: col.isDraggable,
		visible: col.isShow,
		type: mapMarketTypeToGeneric(col.type),
		group: {
			name: col.group.name,
			displayName: col.group.name.charAt(0).toUpperCase() + col.group.name.slice(1),
		},
	}));
}

export function adaptMarketDataToGeneric(
	markets: IMarketDomain[],
	columns: ITableColumn[],
): IGenericTableRow<Record<string, unknown>>[] {
	return markets.map(market => ({
		id: market.id,
		data: columns.reduce((acc, col) => {
			if (col.columnName === 'symbol') {
				acc[col.columnName] = {
					symbolType: 'Crypto',
					srcImg: getImagePath(market[col.columnName], ImageTypePath.Currency),
					ticker: market[col.columnName],
					blockchain: '',
				};
				return acc;
			}
			acc[col.columnName] = {
				value: market[col.columnName],
				...(market[col.columnName + 'Symbol'] ? { currencySymbol: market[col.columnName + 'Symbol'] } : {}),
				...(market[col.columnName + 'Magnitude'] ? { magnitude: market[col.columnName + 'Magnitude'] } : {}),
			};
			return acc;
		}, {} as Record<string, unknown>),
		metadata: {
			srcValue: market.srcValue,
		},
	}));
}

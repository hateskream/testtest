// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import type { IGenericTableColumn, IGenericTableRow, IGenericTableSection } from '@/modules/table';
import type { ITableColumn, IWatchlistSection, IWatchlistRow } from '../model';

/**
 * Конвертирует колонки watchlist в формат GenericDataTable
 */
export function adaptWatchlistColumnsToGeneric(watchlistColumns: ITableColumn[]): IGenericTableColumn[] {
	return watchlistColumns.map(col => ({
		key: col.columnType,
		label: col.displayColumnName,
		shortLabel: col.displayShortColumnName,
		position: col.position,
		sortable: true,
		draggable: col.isDraggable,
		visible: col.isShow,
		width: col.width,
		minWidth: 100,
		type: col.type,
		group: {
			name: col.group?.name || 'general',
			displayName: col.group?.name || 'General',
		},
	}));
}

/**
 * Конвертирует строки watchlist в формат GenericDataTable
 */
export function adaptWatchlistRowsToGeneric(watchlistRows: IWatchlistRow[]): IGenericTableRow<IWatchlistRow>[] {
	return watchlistRows.map(row => ({
		id: row.tickerID,
		data: row,
		metadata: {
			original: row,
		},
	}));
}

/**
 * Конвертирует секции watchlist в формат GenericDataTable
 */
// eslint-disable-next-line @stylistic/max-len
export function adaptWatchlistSectionsToGeneric(watchlistSections: IWatchlistSection[]): IGenericTableSection<IWatchlistRow>[] {
	return watchlistSections.map(section => ({
		id: section.id,
		title: section.name,
		isCollapsed: !section.isOpen,
		rows: adaptWatchlistRowsToGeneric(section.rows),
	}));
}

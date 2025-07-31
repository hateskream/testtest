import type { IWatchlistColumn, ITableColumn } from '../model';
import { INITIAL_ALL_TABLE_COLUMNS } from '../const';
import { setPositionColumns } from './set-positions-columns';

/**
 * Адаптирует колонки из API (IWatchlistColumn[]) в формат для store (ITableColumn[])
 * Объединяет данные из API с предустановленными UI настройками
 */
export function adaptApiColumnsToStore(apiColumns: IWatchlistColumn[]): ITableColumn[] {
	// Создаем маппинг предустановленных UI колонок
	const uiColumnsMap = new Map<string, ITableColumn>();
	INITIAL_ALL_TABLE_COLUMNS.forEach(col => {
		// FIXME: update constant: columnName -> columnType
		uiColumnsMap.set(col.columnName, col);
	});

	// Адаптируем API колонки, дополняя их UI настройками
	const adaptedColumns = apiColumns
		.map(apiCol => {
			const uiCol = uiColumnsMap.get(apiCol.columnType);
			if (!uiCol) {
				// eslint-disable-next-line no-console
				console.warn(`No UI configuration found for column type: ${apiCol.columnType}`);
				return null;
			}

			return {
				...uiCol, // UI настройки из констант
				...apiCol, // Данные из API (переопределяют UI если есть конфликт)
				// Обеспечиваем совместимость полей
				id: apiCol.id || uiCol.id,
				columnType: apiCol.columnType,
				isShow: apiCol.isShow ?? uiCol.isShow,
				order: apiCol.order || uiCol.order,
				width: apiCol.width || uiCol.width || 100,
				position: 0, // Позиция будет пересчитана ниже
			} as ITableColumn;
		})
		.filter(Boolean) as ITableColumn[];

	// Фильтруем только видимые колонки и сортируем по order
	const visibleColumns = adaptedColumns
		.filter(col => col.isShow)
		.sort((a, b) => a.order - b.order);

	// Устанавливаем правильные позиции на основе порядка в отсортированном массиве
	return setPositionColumns(visibleColumns);
}

/**
 * Обновляет существующие store колонки данными из API, сохраняя пользовательские настройки
 */
export function updateStoreColumnsWithApiData(
	storeColumns: ITableColumn[],
	apiColumns: IWatchlistColumn[],
): ITableColumn[] {
	const apiColumnsMap = new Map<string, IWatchlistColumn>();
	apiColumns.forEach(col => {
		apiColumnsMap.set(col.columnType, col);
	});

	return storeColumns.map(storeCol => {
		const apiCol = apiColumnsMap.get(storeCol.columnType);
		if (apiCol) {
			return {
				...storeCol,
				// Обновляем только мета-данные из API, сохраняя пользовательские настройки
				width: apiCol.width || storeCol.width,
				// Не обновляем isShow, order, position - это пользовательские настройки
			};
		}
		return storeCol;
	});
}

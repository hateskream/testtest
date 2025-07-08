import { allWidgets } from '../../../domains/entities/widget';
import type { IGetWidgetListUc } from '../../../domains/uce-cases';
import { mapWidgetsPreset } from './mappers';

export function GetWidgetList(): IGetWidgetListUc {
	return {
		async execute() {

			const widgets = allWidgets();

			return {
				widgets: mapWidgetsPreset(widgets),
			};
		},
	};
}

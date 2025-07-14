import { PresetWidget } from '@/modules/dashboard-group/core/domains/entities/widget';
import type { IGetWidgetListUc } from '../../../domains/uce-cases';
import { mapWidgetsPreset } from './mappers';

export function GetWidgetList(): IGetWidgetListUc {
	return {
		async execute() {

			const widgets = PresetWidget.allWidgets();

			return {
				widgets: mapWidgetsPreset(widgets),
			};
		},
	};
}

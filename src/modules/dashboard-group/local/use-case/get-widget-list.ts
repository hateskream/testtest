import { allWidgets } from '../../domains/entities/widget';
import type { IGetWidgetListUc } from '../../domains/uce-cases';

export function GetWidgetList(): IGetWidgetListUc {
	return {
		async execute() {

			const widgets = allWidgets();

			return {
				widgets,
			};
		},
	};
}

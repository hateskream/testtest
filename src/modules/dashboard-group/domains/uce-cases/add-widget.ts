import type { IPosition } from './dto';

export interface IAddWidgetUc {
	execute(in_: IInAddWidget): Promise<IOutAddWidget>;
}

export interface IInAddWidget {
	widgetType: string;
	position: IPosition;
}

export interface IOutAddWidget {
	widgetId: string;
}

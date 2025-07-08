import type { IPosition, IWidget, IWidgetState } from './dto';

export interface IAddWidgetUc {
	execute(in_: IInAddWidget): Promise<IOutAddWidget>;
}

export interface IInAddWidget {
	widgetType: string;
	position: IPosition;
	widgetsState: IWidgetState[];
}

export interface IOutAddWidget {
	widget: IWidget;
}

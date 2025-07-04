import type { IWidgetState } from './dto';

export interface IDeleteWidgetUc {
	execute(in_: IInDeleteWidget): Promise<IOutDeleteWidget>;
}

export interface IInDeleteWidget {
	widgetId: string;
	dashboardState: IWidgetState[];
}

export interface IOutDeleteWidget {
	widgetId: string;
}

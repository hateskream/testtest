export interface IGetAllWidgetIdsUc {
	execute(in_: IInGetAllWidgetIds): Promise<IOutGetAllWidgetIds>;
}

export interface IInGetAllWidgetIds {
	widgetType: string;
}

export interface IOutGetAllWidgetIds {
	ids: string[];
}

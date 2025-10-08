import type { ISize } from './widget';

export interface IMeta {
	widgetId: string;
	isResizing: boolean;
	isLoading: boolean;
	market: string;
	name: string;
	size: ISize;
	defaultStateType: string;
	dashboards: {
		id: string;
		name: string;
	}[];
}

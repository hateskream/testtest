export interface INoteItem {
	id: string;
	title: string;
	description: string;
	productLink?: string;
	figmaLink?: string;
}

export interface IWeekGroup {
	week: string | number;
	items: INoteItem[];
}

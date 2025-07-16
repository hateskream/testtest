export interface IModalFilterTicker {
	id: string;
	image: string;
	name: string;
	ticker: string;
	isSelected: boolean;
}

export interface IModalFilterTickerLists {
	[x: string]: IModalFilterTicker[];
}

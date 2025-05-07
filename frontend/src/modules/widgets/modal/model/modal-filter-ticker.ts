export interface IModalFilterTicker {
	image: string;
	name: string;
	ticker: string;
	isSelected: boolean;
}

export type IModalFilterTickerWithGroup = IModalFilterTicker & { group: string };

export interface IModalFilterTickerLists {
	[x: string]: IModalFilterTicker[];
}

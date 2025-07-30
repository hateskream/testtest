export interface ITreemapItem {
	ticker: string;
	name: string;
	logoSrc: string;
	values: Record<string, number>;
}

export interface ITreemap {
	items: ITreemapItem[];
	currencySymbol: string;
}

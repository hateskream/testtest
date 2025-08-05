interface IBaseItem {
	ticker: string;
	name: string;
	logoSrc: string;
}

type ValueKey = string;

export interface ITreemapItem extends IBaseItem {
	values: Record<ValueKey, number | string>;
}

export interface ITreemap {
	items: ITreemapItem[];
	currencySymbol: string;
}

export interface IHeatmapItem extends IBaseItem {
	values: Record<ValueKey, number[]>;
}

export interface IHeatmap {
	items: IHeatmapItem[];
}

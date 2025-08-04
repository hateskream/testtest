export interface IDisplaySettings {
	market: IMarket;
	sizeBy?: ISettings[];
	groupBy?: ISettings[];
	colorBy: IColorBy[];
	displayValue: ISettings[];
}

export interface IMarket {
	displayName: string;
	id: string;
}

export interface ISettings {
	key: string;
	displayName: string;
	isPercent: boolean;
}

export interface IColorBy {
	colorBy: ISettings;
	colorDepth: IColorDepth[];
}

export interface IColorDepth {
	id: string;
	start: number;
	end: number;
}

export const NO_GROUP: ISettings = {
	key: 'none',
	displayName: 'No group',
	isPercent: false,
};

export enum TitleViewVariant {
	TICKER = 'Ticker',
	NAME = 'Name',
	NONE = 'None',
}

export enum TitleKey {
	TICKER = 'ticker',
	NAME = 'name',
}


export interface IMarketSettings {
	active: string;
	markets: IMarket[];
}

export interface ISingleSetting {
	active: string;
	values: ISettings[];
}

export interface IColorDepthSetting {
	active: string;
	values: IColorDepth[];
}

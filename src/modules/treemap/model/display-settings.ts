export interface IDisplaySettingsByMarket {
	stock: IDisplaySettings;
	crypto: IDisplaySettings;
}

interface IDisplaySettings {
	sizeBy: ISettings[];
	colorBy: IColorBy[];
	displayValue: ISettings[];
}

interface ISettings {
	key: string;
	displayName: string;
	isPercent: boolean;
}

interface IColorBy {
	colorBy: ISettings;
	colorDepth: IColorDepth[];
}

interface IColorDepth {
	start: number;
	end: number;
}

export enum TitleViewVariant {
	TICKER = 'Ticker',
	NAME = 'Name',
	NONE = 'None',
}

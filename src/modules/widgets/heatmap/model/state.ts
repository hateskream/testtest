import { displaySettings, TitleViewVariant } from './display-settings';

export interface IDisplayState {
	sizeBy?: string;
	groupBy?: string;
	colorBy: string;
	colorDepth: string;
	displayValue: string;
	isShowLogo: boolean;
	titleSetting: TitleViewVariant;
}

export interface IState {
	activeMarketId: string;
	settings: Record<string, IDisplayState>;
}

export function getDefaultState(): IState {
	return {
		activeMarketId: 'crypto',
		settings: {
			crypto: {
				sizeBy: displaySettings['crypto']?.sizeBy?.[0].key || '',
				groupBy: displaySettings['crypto']?.groupBy?.[0].key || '',
				colorBy: displaySettings['crypto']?.colorBy?.[0].colorBy.key || '',
				colorDepth: displaySettings['crypto']?.colorBy?.[0].colorDepth[0].id || '',
				displayValue: displaySettings['crypto']?.displayValue?.[0].key || '',
				isShowLogo: true,
				titleSetting: TitleViewVariant.TICKER,
			},
			stock: {
				sizeBy: displaySettings['stock']?.sizeBy?.[0].key || '',
				groupBy: displaySettings['stock']?.groupBy?.[0].key || '',
				colorBy: displaySettings['stock']?.colorBy?.[0].colorBy.key || '',
				colorDepth: displaySettings['stock']?.colorBy?.[0].colorDepth[0].id || '',
				displayValue: displaySettings['stock']?.displayValue?.[0].key || '',
				isShowLogo: true,
				titleSetting: TitleViewVariant.TICKER,
			},
			forex: {
				sizeBy: displaySettings['forex']?.sizeBy?.[0].key || '',
				groupBy: displaySettings['forex']?.groupBy?.[0].key || '',
				colorBy: displaySettings['forex']?.colorBy?.[0].colorBy.key || '',
				colorDepth: displaySettings['forex']?.colorBy?.[0].colorDepth[0].id || '',
				displayValue: displaySettings['forex']?.displayValue?.[0].key || '',
				isShowLogo: true,
				titleSetting: TitleViewVariant.TICKER,
			},
		},
	};
}

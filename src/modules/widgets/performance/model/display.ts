import { IconIds } from '@/shared/ui/icon';

export enum DisplayVariant {
	Bar = 'bar',
	List = 'list',
}

interface IDisplayVariantView {
	icon: IconIds;
	label: string;
}

export const displayVariantToView: Readonly<Record<DisplayVariant, IDisplayVariantView>> = {
	[DisplayVariant.Bar]: {
		icon: IconIds.Bars,
		label: 'Bar',
	},
	[DisplayVariant.List]: {
		icon: IconIds.List,
		label: 'List',
	},
};

export enum SymbolDisplayVariant {
	Ticker = 'ticker',
	Logo = 'logo',
}

export const symbolDisplayVariantToView: Readonly<Record<SymbolDisplayVariant, string>> = {
	[SymbolDisplayVariant.Ticker]: 'Ticker',
	[SymbolDisplayVariant.Logo]: 'Logo',
};

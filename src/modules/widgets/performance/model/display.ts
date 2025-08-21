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

import { IconIds } from '@/shared/ui/icon';
import { RouteNames } from '@/types/route.d';

export interface IMenuItem {
	icon: IconIds;
	text: string;
	link: { name: RouteNames } | (string & Record<never, never>);
	isActive: boolean;
	comingSoon?: IMenuItemComingSoon | null;
}

export interface IMenuItemComingSoon {
	title: string;
	text: string;
	release?: string;
}

export const menuItems: IMenuItem[] = [
	{
		icon: IconIds.Board,
		text: 'Board',
		link: { name: RouteNames.Home },
		isActive: false,
	},
	{
		icon: IconIds.Screen,
		text: 'Screen',
		link: { name: RouteNames.Screener },
		isActive: false,
		comingSoon: {
			title: 'Screener',
			text: 'Screen the market for top performers — coming soon.',
		},
	},
	{
		icon: IconIds.Heat,
		text: 'Heat',
		link: { name: RouteNames.Heatmap },
		isActive: false,
		comingSoon: {
			title: 'Heatmap',
			text: 'Explore market performance and spot trends — coming soon.',
		},
	},
	{
		icon: IconIds.Cal,
		text: 'Cal',
		link: { name: RouteNames.Calendar },
		isActive: false,
		comingSoon: {
			title: 'Calendar',
			text: 'Stay ahead with key market events — coming soon.',
		},
	},
	{
		icon: IconIds.News,
		text: 'News',
		link: { name: RouteNames.News },
		isActive: false,
		comingSoon: {
			title: 'News',
			text: 'Stay in the know with market updates — coming soon.',
		},
	},
	{
		icon: IconIds.TV,
		text: 'TV',
		link: { name: RouteNames.Tv },
		isActive: false,
		comingSoon: {
			title: 'TV View',
			text: 'Enjoy an optimized layout for large screens — coming soon.',
		},
	},
] as const;

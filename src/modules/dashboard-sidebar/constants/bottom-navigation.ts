import type { IBottomNavigationItem } from '../types/bottom-navigation.ts';
import { IconIds } from '@/shared/ui/icon';
import { RouteNames } from '@/types/route.d';

export const bottomNavigation: IBottomNavigationItem[] = [
	{
		icon: IconIds.BottomLinkNav,
		routeName: RouteNames.Home,
		id: IconIds.Home,
	},
	{
		icon: IconIds.BottomLinkPay,
		routeName: RouteNames.Home,
		id: IconIds.Home,
	},
	{
		icon: IconIds.BottomLinkI88,
		routeName: RouteNames.Home,
		id: IconIds.Home,
	},
	{
		icon: IconIds.BottomLinkGgp,
		routeName: RouteNames.Home,
		id: IconIds.Home,
	},
	{
		icon: IconIds.BottomLinkGlobus,
		routeName: RouteNames.Home,
		id: IconIds.Home,
	},
];

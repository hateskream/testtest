import type { INavigationItem } from '../types/navigation.ts';
import { IconIds } from '@/shared/ui/icon';
import { RouteLabels, RouteNames } from '@/types/route.d';

export const navigation: INavigationItem[] = [
	{
		icon: IconIds.Home,
		id: IconIds.Home,
		routeName: RouteNames.Home,
		routeLabels: RouteLabels.Home,
	},
	{
		icon: IconIds.Heatmap,
		id: IconIds.Heatmap,
		routeName: RouteNames.Heatmap,
		routeLabels: RouteLabels.Heatmap,
	},
	{
		icon: IconIds.Screener,
		id: IconIds.Screener,
		routeName: RouteNames.Screener,
		routeLabels: RouteLabels.Screener,
	},
	{
		icon: IconIds.Calendar,
		id: IconIds.Calendar,
		routeName: RouteNames.Calendar,
		routeLabels: RouteLabels.Calendar,
	},
	{
		icon: IconIds.LogoWidgetNews,
		id: IconIds.LogoWidgetNews,
		routeName: RouteNames.News,
		routeLabels: RouteLabels.News,
	},
];

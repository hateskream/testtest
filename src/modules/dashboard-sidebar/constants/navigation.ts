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
];

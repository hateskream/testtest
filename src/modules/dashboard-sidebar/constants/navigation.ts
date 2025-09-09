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
		icon: IconIds.Chart,
		id: IconIds.Chart,
		routeName: RouteNames.TickerStock,
		routeLabels: RouteLabels.TickerStock,
		routeParams: { id: 1 },
	},
	{
		icon: IconIds.Chart,
		id: IconIds.Chart,
		routeName: RouteNames.TickerCrypto,
		routeLabels: RouteLabels.TickerCrypto,
		routeParams: { id: 1 },
	},
	{
		icon: IconIds.Chart,
		id: IconIds.Chart,
		routeName: RouteNames.TickerIndices,
		routeLabels: RouteLabels.TickerIndices,
		routeParams: { id: 1 },
	},
	{
		icon: IconIds.Chart,
		id: IconIds.Chart,
		routeName: RouteNames.TickerForex,
		routeLabels: RouteLabels.TickerForex,
		routeParams: { id: 1 },
	},
	{
		icon: IconIds.Chart,
		id: IconIds.Chart,
		routeName: RouteNames.TickerCommodities,
		routeLabels: RouteLabels.TickerCommodities,
		routeParams: { id: 1 },
	},
	{
		icon: IconIds.Chart,
		id: IconIds.Chart,
		routeName: RouteNames.TickerETF,
		routeLabels: RouteLabels.TickerETF,
		routeParams: { id: 1 },
	},
	{
		icon: IconIds.Heatmap,
		id: IconIds.Heatmap,
		routeName: RouteNames.Heatmap,
		routeLabels: RouteLabels.Heatmap,
	},
];

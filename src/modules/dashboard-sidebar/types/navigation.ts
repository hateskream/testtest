import { IconIds } from '@/shared/ui/icon';
import { RouteLabels, RouteNames } from '@/types/route.d';

export interface INavigationItem {
	icon: IconIds;
	id: IconIds;
	routeName: RouteNames;
	routeLabels: RouteLabels;
	routeParams?: Record<string, string | number>;
}

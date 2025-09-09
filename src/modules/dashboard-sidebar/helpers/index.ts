import type { INavigationItem } from '../types/navigation.ts';
import type { IBottomNavigationItem } from '../types/bottom-navigation.ts';

export const createRouteObject = (item: INavigationItem | IBottomNavigationItem) => {
	return item.routeParams
		? { name: item.routeName, params: item.routeParams }
		: { name: item.routeName };
};
